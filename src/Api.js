export async function GetLeader() {
  const response = await fetch("https://wedev-api.sky.pro/api/v2/leaderboard", {
    method: "GET",
  });
  const data = await response.json();
  return data;
}

export async function AddLeader({ name, time, achievements }) {
  const response = await fetch("https://wedev-api.sky.pro/api/v2/leaderboard", {
    method: "POST",
    body: JSON.stringify({
      name,
      time,
      achievements,
    }),
  });
  const data = response.json();
  return data;
}
