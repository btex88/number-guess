const api = {
  url: 'https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300',

  get: () =>
    fetch(api.url)
      .then((res) => res.json())
      .then((data) => new Promise((resolve, reject) => data.value))
      .catch((err) => {
        (err.statusCode)
      }),
};
