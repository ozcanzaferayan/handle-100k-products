self.addEventListener("message", async (event) => {
  const jsonData = await fetchData();
  self.postMessage(jsonData);
});

const fetchData = async () => {
  const response = await fetch(
    "https://gist.githubusercontent.com/ozcanzaferayan/78a49708285523c17eac88c20591b146/raw/b38dc9eccecab67d0fe840285d13586a811fe4af/products.json"
  );
  const data = await response.json();
  return data;
};
