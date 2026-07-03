const lotteryApiUrl = 'https://thai-lotto-api.vercel.app/api/lotto?limit=30';
fetch(lotteryApiUrl)
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
