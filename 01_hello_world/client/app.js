const fetchGreeting = async () => {
    const response = await fetch('http://localhost:9000/', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({query: 'query { greeting }'})
    });
    const greeting = await response.json();
    console.log("Body: ", greeting)
    return greeting
    // const title = document.querySelector('strong');
    // title.textContent = greeting.data.greeting;

    // const t1 = document.getElementById('message');
    // t1.textContent = greeting.data.greeting;
}

fetchGreeting().then((greeting) => {
    const t1 = document.getElementById('message');
    t1.textContent = greeting.data.greeting;
});