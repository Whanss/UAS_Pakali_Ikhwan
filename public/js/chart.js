let originalData = [];
let charts = {};

// Simple, professional color palette
const colors = {
  primary: "#3498db",
  secondary: "#2c3e50",
  success: "#27ae60",
  warning: "#f39c12",
  danger: "#e74c3c",
  info: "#16a085",
  gray: "#95a5a6",
};

const chartColors = [
  "#3498db",
  "#2c3e50",
  "#27ae60",
  "#f39c12",
  "#e74c3c",
  "#16a085",
  "#95a5a6",
];

document.addEventListener("DOMContentLoaded", () => fetchData());

async function fetchData() {
  try {
    const res = await fetch("/api/stats");
    const data = await res.json();
    originalData = data.map((d) => ({
      ...d,
      kills: parseInt(d.eliminasi),
      damage: parseInt(d.total_damage),
      headshot_rate: parseFloat(d.akurasi_presisi),
      game_mode: d.kategori_kompetisi,
      survival_time: parseFloat(d.durasi_bertahan || 0),
      displayDate: new Date(d.tanggal).toLocaleDateString("id-ID"),
    }));
    updateDashboard(originalData);
  } catch (err) {
    console.error(err);
  }
}

function updateDashboard(data) {
  updateStatistics(data);
  createAllCharts(data);
}

function updateStatistics(data) {
  document.getElementById("totalKills").innerText = data.reduce(
    (sum, d) => sum + d.kills,
    0,
  );
  document.getElementById("totalDamage").innerText = Math.round(
    data.reduce((sum, d) => sum + d.damage, 0) / data.length || 0,
  );
  document.getElementById("avgHeadshot").innerText =
    (
      data.reduce((sum, d) => sum + d.headshot_rate, 0) / data.length || 0
    ).toFixed(1) + "%";
}

function createAllCharts(data) {
  createKillsPerTier(data);
  createAvgDamageByTier(data);
  createModeDistribution(data);
  createTierDistribution(data);
  createHeadshotTrend(data);
  createSurvivalVsDamage(data);
}

// Chart 1: Total Kills per Tier (Bar)
function createKillsPerTier(data) {
  const tierData = {};
  data.forEach((d) => {
    tierData[d.tier] = (tierData[d.tier] || 0) + d.kills;
  });

  const ctx = document.getElementById("killsPerTier").getContext("2d");
  if (charts.killsPerTier) charts.killsPerTier.destroy();

  charts.killsPerTier = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(tierData),
      datasets: [
        {
          label: "Total Eliminasi",
          data: Object.values(tierData),
          backgroundColor: colors.primary,
          borderColor: colors.secondary,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "#e0e0e0",
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

// Chart 2: Radar Chart - Average Damage by Tier
function createAvgDamageByTier(data) {
  const tierData = {};
  const tierCount = {};

  data.forEach((d) => {
    tierData[d.tier] = (tierData[d.tier] || 0) + d.damage;
    tierCount[d.tier] = (tierCount[d.tier] || 0) + 1;
  });

  const avgDamage = Object.keys(tierData).map(
    (tier) => tierData[tier] / tierCount[tier],
  );

  const ctx = document.getElementById("avgDamageByTier").getContext("2d");
  if (charts.avgDamageByTier) charts.avgDamageByTier.destroy();

  charts.avgDamageByTier = new Chart(ctx, {
    type: "radar",
    data: {
      labels: Object.keys(tierData),
      datasets: [
        {
          label: "Rata-rata Damage",
          data: avgDamage,
          borderColor: colors.danger,
          backgroundColor: "rgba(231, 76, 60, 0.2)",
          borderWidth: 2,
          pointBackgroundColor: colors.danger,
          pointBorderColor: "#fff",
          pointBorderWidth: 1,
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          grid: {
            color: "#e0e0e0",
          },
        },
      },
    },
  });
}

// Chart 3: Game Mode Distribution (Pie)
function createModeDistribution(data) {
  const modeData = {};
  data.forEach((d) => {
    modeData[d.game_mode] = (modeData[d.game_mode] || 0) + 1;
  });

  const ctx = document.getElementById("modeDistribution").getContext("2d");
  if (charts.modeDistribution) charts.modeDistribution.destroy();

  charts.modeDistribution = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(modeData),
      datasets: [
        {
          data: Object.values(modeData),
          backgroundColor: chartColors,
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 10,
            font: {
              size: 11,
            },
          },
        },
      },
    },
  });
}

// Chart 4: Tier Distribution (Doughnut)
function createTierDistribution(data) {
  const tierData = {};
  data.forEach((d) => {
    tierData[d.tier] = (tierData[d.tier] || 0) + 1;
  });

  const ctx = document.getElementById("tierDistribution").getContext("2d");
  if (charts.tierDistribution) charts.tierDistribution.destroy();

  charts.tierDistribution = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: Object.keys(tierData),
      datasets: [
        {
          data: Object.values(tierData),
          backgroundColor: chartColors,
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 10,
            font: {
              size: 11,
            },
          },
        },
      },
    },
  });
}

// Chart 5: Headshot Accuracy Trend (Line)
function createHeadshotTrend(data) {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.tanggal) - new Date(b.tanggal),
  );

  const ctx = document.getElementById("headshotTrend").getContext("2d");
  if (charts.headshotTrend) charts.headshotTrend.destroy();

  charts.headshotTrend = new Chart(ctx, {
    type: "line",
    data: {
      labels: sortedData.map((d, i) => `Pertandingan ${i + 1}`),
      datasets: [
        {
          label: "Akurasi (%)",
          data: sortedData.map((d) => d.headshot_rate),
          borderColor: colors.success,
          backgroundColor: "rgba(39, 174, 96, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointBackgroundColor: colors.success,
          pointBorderColor: "#fff",
          pointBorderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: {
            color: "#e0e0e0",
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8,
          },
        },
      },
    },
  });
}

// Chart 6: Survival Time vs Damage (Bubble)
function createSurvivalVsDamage(data) {
  const ctx = document.getElementById("survivalVsDamage").getContext("2d");
  if (charts.survivalVsDamage) charts.survivalVsDamage.destroy();

  charts.survivalVsDamage = new Chart(ctx, {
    type: "bubble",
    data: {
      datasets: [
        {
          label: "Players",
          data: data.map((d) => ({
            x: d.survival_time,
            y: d.damage,
            r: Math.max(d.kills * 2 + 3, 5),
          })),
          backgroundColor: "rgba(52, 152, 219, 0.6)",
          borderColor: colors.primary,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `Waktu Bertahan: ${context.parsed.x.toFixed(1)}m, Damage: ${context.parsed.y}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Waktu Bertahan (menit)",
            font: {
              size: 11,
              weight: "500",
            },
          },
          grid: {
            color: "#e0e0e0",
          },
        },
        y: {
          title: {
            display: true,
            text: "Damage yang Diberikan",
            font: {
              size: 11,
              weight: "500",
            },
          },
          grid: {
            color: "#e0e0e0",
          },
        },
      },
    },
  });
}
