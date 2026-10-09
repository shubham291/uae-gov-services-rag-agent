import requests

# response = requests.get("https://jsonplaceholder.typicode.com/users")

# print(response.json())

url = "http://localhost:3000/api/search"
while True:
    query = input("Ask: ")
    if query == "exit":
        break


    response = requests.post(url, json={"query": query})
    # print(response.json())
    if not response.ok:
        print(response.status, "Search Failed")
        exit()

    results = response.json()
    data_results = results['data']['results']
    print(data_results,"results")
    if not data_results:
        print("No results found.")
        exit()

    print(f"Source: {data_results[0]['source']}, Similarity: {data_results[0]['similarity']:.1f}")

