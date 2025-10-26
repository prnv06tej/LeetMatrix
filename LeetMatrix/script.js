document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    // Validate username format
    function validateUsername(username) {
        if(username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    // Fetch user stats from LeetCode API
    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            statsContainer.classList.add("hidden");

            const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
            const response = await fetch(url);
            
            if(!response.ok) {
                throw new Error("Unable to fetch user details. Please check the username.");
            }
            
            const data = await response.json();
            console.log("Fetched data:", data);

            displayUserData(data);
        }
        catch(error) {
            statsContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
            statsContainer.classList.remove("hidden");
        }
        finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    // Update progress circle
    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    // Display user statistics
    function displayUserData(data) {
        // Update progress circles
        updateProgress(data.easySolved, data.totalEasy, easyLabel, easyProgressCircle);
        updateProgress(data.mediumSolved, data.totalMedium, mediumLabel, mediumProgressCircle);
        updateProgress(data.hardSolved, data.totalHard, hardLabel, hardProgressCircle);

        // Create stats cards
        const cardsData = [
            { label: "Total Solved", value: data.totalSolved },
            { label: "Easy Solved", value: data.easySolved },
            { label: "Medium Solved", value: data.mediumSolved },
            { label: "Hard Solved", value: data.hardSolved },
            { label: "Acceptance Rate", value: data.acceptanceRate + "%" },
            { label: "Ranking", value: data.ranking ? `#${data.ranking.toLocaleString()}` : "N/A" }
        ];

        // Render cards
        cardStatsContainer.innerHTML = cardsData.map(item => 
            `<div class="card">
                <h4>${item.label}</h4>
                <p>${item.value}</p>
            </div>`
        ).join("");

        // Show stats container
        statsContainer.classList.remove("hidden");
    }

    // Search button click handler
    searchButton.addEventListener('click', function() {
        const username = usernameInput.value;
        console.log("Searching for username:", username);
        
        if(validateUsername(username)) {
            fetchUserDetails(username);
        }
    });

    // Allow Enter key to trigger search
    usernameInput.addEventListener('keypress', function(event) {
        if(event.key === 'Enter') {
            searchButton.click();
        }
    });
});