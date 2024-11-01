class FetchClient {
    static baseURL = "http://localhost:8080/api/";

    constructor(){

    }

    async get(endpoint) {
        await fetch(FetchClient.baseURL+endpoint)
          .then(response => {
            if (!response.ok) throw new Error('Network response was not ok: ');
            return response.json();
          })
          .then(data => {
            console.log('Data fetched:', data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    }

    async post(endpoint, data) {
        await fetch(FetchClient.baseURL+endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(response => {
            if (!response.ok) throw new Error('Network response was not ok: '+FetchClient.baseURL+endpoint);
            return response.json();
          })
          .then(data => {
            console.log('Data posted:', data);
          })
          .catch(error => {
            console.error('Error posting data:', error);
          });
    }

}


const FC = new FetchClient();
export default FC;