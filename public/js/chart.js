// ============================================
// BAGIAN 1: GLOBAL VARIABLES & INITIALIZATION
// ============================================
let originalData = [];
let filteredData = [];

document.addEventListener("DOMContentLoaded", function () {
  fetchData();
});

async function fetchData() {
  try {
    const response = await fetch("/api/all-data");
    const allData = await response.json();

    // Formatting tanggal agar lebih mudah dibaca
    originalData = allData.map((d) => {
      const dateObj = new Date(d.match_date);
      return {
        ...d,
        // Format YYYY-MM-DD untuk sorting
        rawDate: dateObj,
        // Format DD MMM untuk display grafik
        displayDate: dateObj.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
        // Pastikan angka adalah number bukan string
        kills: parseInt(d.kills),
        damage: parseInt(d.damage),
        headshot_rate: parseFloat(d.headshot_rate),
        survival_time: parseInt(d.survival_time),
        placement: parseInt(d.placement),
      };
    });

    filteredData = [...originalData];
    updateDashboard(filteredData);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

function updateDashboard(data) {
  // 1. Clear previous charts
  d3.selectAll("#kills-tier-bar svg").remove();
  d3.selectAll("#damage-trend-line svg").remove();
  d3.selectAll("#mode-pie svg").remove();
  d3.selectAll("#top-player-bar svg").remove();
  d3.selectAll("#survival-area svg").remove();
  d3.selectAll("#kill-rank-scatter svg").remove();

  // 2. Process data for each chart
  const killsByTier = processKillsByTier(data);
  const damageByDate = processDamageByDate(data);
  const matchesByMode = processMatchesByMode(data);
  const topPlayers = processTopPlayers(data);
  const survivalByDate = processSurvivalByDate(data);

  // 3. Render charts with specific colors (PUBG Theme Colors)
  renderBarChart(
    "#kills-tier-bar",
    killsByTier,
    "tier",
    "total_kills",
    "#d9534f",
  ); // Merah
  renderLineChart(
    "#damage-trend-line",
    damageByDate,
    "date",
    "total_damage",
    "#f0ad4e",
  ); // Kuning/Emas
  renderPieChart("#mode-pie", matchesByMode, "mode", "total_matches"); // Warna-warni
  renderHorizontalBarChart(
    "#top-player-bar",
    topPlayers,
    "username",
    "total_kills",
    "#5bc0de",
  ); // Biru
  renderAreaChart(
    "#survival-area",
    survivalByDate,
    "date",
    "avg_survival",
    "#5cb85c",
  ); // Hijau
  renderScatterPlot("#kill-rank-scatter", data, "#d9534f"); // Merah Scatter

  // 4. Render table & Update Stats
  renderTable(data);
  updateStatistics(data);
}

function updateStatistics(data) {
  const totalKills = data.reduce((sum, d) => sum + d.kills, 0);
  const totalDamage = data.reduce((sum, d) => sum + d.damage, 0);
  const totalMatches = data.length;
  const avgHeadshot =
    data.length > 0
      ? (
          data.reduce((sum, d) => sum + d.headshot_rate, 0) / data.length
        ).toFixed(2)
      : 0;

  // Animasi angka (optional simple counter)
  document.getElementById("totalKills").textContent = new Intl.NumberFormat(
    "id-ID",
  ).format(totalKills);
  document.getElementById("totalDamage").textContent = new Intl.NumberFormat(
    "id-ID",
  ).format(totalDamage);
  document.getElementById("totalMatches").textContent = new Intl.NumberFormat(
    "id-ID",
  ).format(totalMatches);
  document.getElementById("avgHeadshot").textContent = avgHeadshot + "%";
  document.getElementById("dataCount").textContent = data.length;
}

function applyFilters() {
  const mode = document.getElementById("filterMode").value;
  const tier = document.getElementById("filterTier").value;
  const sortBy = document.getElementById("sortBy").value;

  let filtered = [...originalData];

  // Filter Logic
  if (mode) filtered = filtered.filter((d) => d.game_mode === mode);
  if (tier) filtered = filtered.filter((d) => d.tier === tier);

  // Sort Logic
  if (sortBy !== "default") {
    const [field, order] = sortBy.split("-");
    filtered.sort((a, b) => {
      let aVal, bVal;
      if (field === "kills") {
        aVal = a.kills;
        bVal = b.kills;
      } else if (field === "damage") {
        aVal = a.damage;
        bVal = b.damage;
      } else if (field === "hs") {
        aVal = a.headshot_rate;
        bVal = b.headshot_rate;
      }

      return order === "desc" ? bVal - aVal : aVal - bVal;
    });
  } else {
    // Default sort by Date Descending
    filtered.sort((a, b) => b.rawDate - a.rawDate);
  }

  filteredData = filtered;
  updateDashboard(filteredData);
}

function resetFilters() {
  document.getElementById("filterMode").value = "";
  document.getElementById("filterTier").value = "";
  document.getElementById("sortBy").value = "default";
  filteredData = [...originalData];
  updateDashboard(filteredData);
}

// ============================================
// BAGIAN 2: DATA PROCESSING FUNCTIONS
// ============================================

// 1. Group Kills by Tier
function processKillsByTier(data) {
  const grouped = {};
  data.forEach((row) => {
    if (!grouped[row.tier]) grouped[row.tier] = 0;
    grouped[row.tier] += row.kills;
  });
  // Order tiers logically if needed, but for now simple object keys
  return Object.keys(grouped).map((key) => ({
    tier: key,
    total_kills: grouped[key],
  }));
}

// 2. Group Damage by Date
function processDamageByDate(data) {
  const grouped = {};
  data.forEach((row) => {
    if (!grouped[row.displayDate]) grouped[row.displayDate] = 0;
    grouped[row.displayDate] += row.damage;
  });
  return Object.keys(grouped)
    .map((key) => ({
      date: key,
      total_damage: grouped[key],
    }))
    .slice(0, 7); // Ambil 7 hari terakhir saja agar grafik rapi
}

// 3. Group Matches by Game Mode
function processMatchesByMode(data) {
  const grouped = {};
  data.forEach((row) => {
    if (!grouped[row.game_mode]) grouped[row.game_mode] = 0;
    grouped[row.game_mode] += 1;
  });
  return Object.keys(grouped).map((key) => ({
    mode: key,
    total_matches: grouped[key],
  }));
}

// 4. Top 5 Players by Kills
function processTopPlayers(data) {
  const grouped = {};
  data.forEach((row) => {
    if (!grouped[row.username]) grouped[row.username] = 0;
    grouped[row.username] += row.kills;
  });

  return Object.keys(grouped)
    .map((key) => ({
      username: key,
      total_kills: grouped[key],
    }))
    .sort((a, b) => b.total_kills - a.total_kills)
    .slice(0, 5); // Top 5 Only
}

// 5. Survival Time Trend (Avg minutes)
function processSurvivalByDate(data) {
  const grouped = {};
  const counts = {};

  data.forEach((row) => {
    if (!grouped[row.displayDate]) {
      grouped[row.displayDate] = 0;
      counts[row.displayDate] = 0;
    }
    grouped[row.displayDate] += row.survival_time / 60; // Convert seconds to minutes
    counts[row.displayDate] += 1;
  });

  return Object.keys(grouped)
    .map((key) => ({
      date: key,
      avg_survival: Math.round(grouped[key] / counts[key]), // Rata-rata
    }))
    .slice(0, 7);
}

// ============================================
// BAGIAN 3: CHART RENDERING FUNCTIONS (D3.js)
// ============================================

// 1. Vertical Bar Chart
function renderBarChart(selector, data, xKey, yKey, color) {
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };
  const width = 300 - margin.left - margin.right;
  const height = 280 - margin.top - margin.bottom;

  const svg = d3
    .select(selector)
    .append("svg")
    .attr("viewBox", `0 0 300 280`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(data.map((d) => d[xKey]))
    .padding(0.2);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d[yKey])])
    .range([height, 0]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  svg.append("g").call(d3.axisLeft(y).ticks(5));

  // Tooltip
  const tooltip = createTooltip();

  svg
    .selectAll("bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d[xKey]))
    .attr("y", (d) => y(+d[yKey]))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(+d[yKey]))
    .attr("fill", color)
    .style("opacity", 0.8)
    .on("mouseover", function (event, d) {
      d3.select(this).style("opacity", 1);
      tooltip
        .style("opacity", 1)
        .html(`${d[xKey]}<br/>Total: ${d[yKey]} Kills`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).style("opacity", 0.8);
      tooltip.style("opacity", 0);
    });
}

// 2. Line Chart
function renderLineChart(selector, data, xKey, yKey, color) {
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 300 - margin.left - margin.right;
  const height = 280 - margin.top - margin.bottom;

  const svg = d3
    .select(selector)
    .append("svg")
    .attr("viewBox", `0 0 300 280`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scalePoint()
    .range([0, width])
    .domain(data.map((d) => d[xKey]))
    .padding(0.5);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d[yKey])])
    .range([height, 0]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));
  svg.append("g").call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".2s")));

  const line = d3
    .line()
    .x((d) => x(d[xKey]))
    .y((d) => y(+d[yKey]));

  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", 3)
    .attr("d", line);

  const tooltip = createTooltip();

  svg
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d[xKey]))
    .attr("cy", (d) => y(+d[yKey]))
    .attr("r", 5)
    .attr("fill", color)
    .on("mouseover", function (event, d) {
      d3.select(this).attr("r", 8);
      tooltip
        .style("opacity", 1)
        .html(`${d[xKey]}<br/>Damage: ${d[yKey]}`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("r", 5);
      tooltip.style("opacity", 0);
    });
}

// 3. Pie Chart
function renderPieChart(selector, data, xKey, yKey) {
  const width = 280,
    height = 280,
    margin = 40;
  const radius = Math.min(width, height) / 2 - margin;

  const svg = d3
    .select(selector)
    .append("svg")
    .attr("viewBox", `0 0 280 280`)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const color = d3.scaleOrdinal(d3.schemeSet2);
  const pie = d3.pie().value((d) => +d[yKey]);
  const data_ready = pie(data);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);
  const tooltip = createTooltip();

  svg
    .selectAll("slices")
    .data(data_ready)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data[xKey]))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.8)
    .on("mouseover", function (event, d) {
      d3.select(this)
        .style("opacity", 1)
        .attr(
          "d",
          d3
            .arc()
            .innerRadius(0)
            .outerRadius(radius + 10),
        );
      tooltip
        .style("opacity", 1)
        .html(`${d.data[xKey]}<br/>${d.data[yKey]} Matches`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    })
    .on("mouseout", function (event, d) {
      d3.select(this).style("opacity", 0.8).attr("d", arc);
      tooltip.style("opacity", 0);
    });
}

// 4. Horizontal Bar Chart
function renderHorizontalBarChart(selector, data, xKey, yKey, color) {
  const margin = { top: 20, right: 30, bottom: 40, left: 100 }; // Left margin gede buat nama user
  const width = 300 - margin.left - margin.right;
  const height = 280 - margin.top - margin.bottom;

  const svg = d3
    .select(selector)
    .append("svg")
    .attr("viewBox", `0 0 300 280`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const y = d3
    .scaleBand()
    .range([0, height])
    .domain(data.map((d) => d[xKey]))
    .padding(0.1);
  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d[yKey])])
    .range([0, width]);

  svg.append("g").call(d3.axisLeft(y));
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(5));

  const tooltip = createTooltip();

  svg
    .selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0))
    .attr("y", (d) => y(d[xKey]))
    .attr("width", (d) => x(+d[yKey]))
    .attr("height", y.bandwidth())
    .attr("fill", color)
    .style("opacity", 0.8)
    .on("mouseover", function (event, d) {
      d3.select(this).style("opacity", 1);
      tooltip
        .style("opacity", 1)
        .html(`${d[xKey]}<br/>Total Kills: ${d[yKey]}`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).style("opacity", 0.8);
      tooltip.style("opacity", 0);
    });
}

// 5. Area Chart
function renderAreaChart(selector, data, xKey, yKey, color) {
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 300 - margin.left - margin.right;
  const height = 280 - margin.top - margin.bottom;

  const svg = d3
    .select(selector)
    .append("svg")
    .attr("viewBox", `0 0 300 280`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scalePoint()
    .range([0, width])
    .domain(data.map((d) => d[xKey]))
    .padding(0.5);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d[yKey])])
    .range([height, 0]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));
  svg.append("g").call(d3.axisLeft(y).ticks(5));

  const area = d3
    .area()
    .x((d) => x(d[xKey]))
    .y0(height)
    .y1((d) => y(+d[yKey]));

  svg
    .append("path")
    .datum(data)
    .attr("fill", color)
    .attr("fill-opacity", 0.3)
    .attr("stroke", color)
    .attr("stroke-width", 1)
    .attr("d", area);

  // Add dots
  const tooltip = createTooltip();
  svg
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d[xKey]))
    .attr("cy", (d) => y(+d[yKey]))
    .attr("r", 4)
    .attr("fill", color)
    .on("mouseover", function (event, d) {
      d3.select(this).attr("r", 6);
      tooltip
        .style("opacity", 1)
        .html(`${d[xKey]}<br/>Avg: ${d[yKey]} Menit`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("r", 4);
      tooltip.style("opacity", 0);
    });
}

// 6. Scatter Plot (Kills vs Rank Placement)
function renderScatterPlot(selector, data, color) {
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };
  const width = 300 - margin.left - margin.right;
  const height = 280 - margin.top - margin.bottom;

  const svg = d3
    .select(selector)
    .append("svg")
    .attr("viewBox", `0 0 300 280`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // X Axis: Rank Placement (1 to 100)
  const x = d3.scaleLinear().domain([0, 20]).range([0, width]); // Anggap max rank ditampilkan 20 besar
  // Y Axis: Kills
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.kills) + 5])
    .range([height, 0]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));
  svg
    .append("text")
    .attr("transform", `translate(${width / 2}, ${height + 35})`)
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .text("Rank #");

  svg.append("g").call(d3.axisLeft(y));
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 15)
    .attr("x", 0 - height / 2)
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .text("Total Kills");

  const tooltip = createTooltip();

  svg
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.placement))
    .attr("cy", (d) => y(d.kills))
    .attr("r", 5)
    .attr("fill", color)
    .style("opacity", 0.6)
    .on("mouseover", function (event, d) {
      d3.select(this).style("opacity", 1).attr("r", 8);
      tooltip
        .style("opacity", 1)
        .html(`${d.username}<br/>Rank #${d.placement} | ${d.kills} Kills`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).style("opacity", 0.6).attr("r", 5);
      tooltip.style("opacity", 0);
    });
}

// Helper: Create Tooltip Div
function createTooltip() {
  // Cek jika tooltip sudah ada biar gak duplikat
  let tooltip = d3.select("body").select(".tooltip");
  if (tooltip.empty()) {
    tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  }
  return tooltip;
}

function renderTable(data) {
  const tbody = document.querySelector("#data-table tbody");
  tbody.innerHTML = data
    .map((row, index) => {
      // Konversi detik ke menit (pembulatan 1 angka di belakang koma)
      const survivalMinutes = (row.survival_time / 60).toFixed(1);

      return `
        <tr>
            <td>${index + 1}</td>
            <td class="fw-bold">${row.username}</td>
            <td><span class="badge bg-secondary">${row.tier}</span></td>
            <td>${row.game_mode}</td>
            <td class="text-danger fw-bold">${row.kills}</td>
            <td>${new Intl.NumberFormat("id-ID").format(row.damage)}</td>
            <td>#${row.placement}</td>
            <td>${survivalMinutes} m</td> <td>${row.headshot_rate}%</td>
            <td>${row.displayDate}</td>
        </tr>
        `;
    })
    .join("");
}
