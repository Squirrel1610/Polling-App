const form = document.getElementById('vote-form');
const inputFields = document.querySelectorAll("input");

form.addEventListener('submit', e=>{
    
    const choice = document.querySelector('input[name=os]:checked').value;
    const data = {os: choice};

    fetch('http://localhost:5000/poll',{
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        inputFields.forEach(field => field.setAttribute("disabled", ""))
    })
    .catch(err => console.log(err));

    e.preventDefault();
});

fetch("http://localhost:5000/poll")
    .then(res => res.json())
    .then(data => {
        let votes = data.votes;
        let totalVotes = votes.length;
        let titleChart = `Total votes: ${totalVotes}`;

        let voteCounts = {
            Windows: 0,
            MacOS: 0,
            Linux: 0,
            Other: 0
        };

        voteCounts = votes.reduce((acc, vote) => (
            (acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc),
            voteCounts
        );

        let dataPoints = [
            { label: 'Windows', y: voteCounts.Windows },
            { label: 'MacOS', y: voteCounts.MacOS },
            { label: 'Linux', y: voteCounts.Linux },
            { label: 'Other', y: voteCounts.Other }
        ];

        console.log(dataPoints, "load");
            
        const chartContainer = document.querySelector('#chartContainer');
        
        if(chartContainer){  
            const chart = new CanvasJS.Chart('chartContainer', {
                animationEnabled: true,
                exportEnable: true,
                title:{
                    text: titleChart
                },
                theme: 'theme1',
                data:[
                    {
                        type: 'column',
                        dataPoints: dataPoints
                    }
                ]
            });
            chart.render();
        
            // // Enable pusher logging - don't include this in production
            // Pusher.logToConsole = true;
        
            var pusher = new Pusher('968961e4b6e147c5c827', {
                cluster: 'ap1'
            });
          
         
            var channel = pusher.subscribe('os-poll');

            channel.bind('os-vote', function(data) {
                console.log(dataPoints);
                dataPoints.forEach((point)=>{
                    if(point.label==data.os)
                    {
                        point.y+=data.points;
                    }
                });
                titleChart = `Total votes: ${data.totalVotes}`;
                chart.title.options.text = titleChart;
                chart.render();
            });
        }
});