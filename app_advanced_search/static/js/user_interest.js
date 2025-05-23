document.addEventListener("DOMContentLoaded", function () {
    //初始化
    const newsCount_tbody = document.getElementById("interest_newsCount_tbody");
    const wordCount_tbody = document.getElementById("interest_wordCount_tbody");
    const selectElement = document.getElementById("keyword_select");
    let weeks = 1;

    // 滑桿初始
    var stepSlider = document.getElementById("week_NoUISlider");
    if (stepSlider) {
        noUiSlider.create(stepSlider, {
            behaviour: 'tap-drag',
            format: wNumb({ decimals: 0 }),
            pips: { mode: 'steps', stepped: true, density: 20 },
            tooltips: true,
            connect: 'lower',
            start: [1],
            step: 1,
            range: { 'min': 1, 'max': 6 }
        });
    }
    // tage輸入框初始
    const tagsInput = new Choices("#tagsInput", {
        delimiter: ",",
        editItems: true,
        removeItemButton: true,
        addItemText: (value) => `請按「Enter」鍵選擇：${value}`
    });
    document.querySelector(".choices__inner").classList.add("form-control");

    // 折線圖初始
    window.top = window.top || {};
    var ctx = document.getElementById("keyword_barChart").getContext("2d");
    window.top.myChart = new Chart(ctx, {
        type: "line",
        options: {
            responsive: true,
            legend: { labels: { fontColor: "#777", fontSize: 12 } },
        },
        data: {
            labels: [],
            datasets: [
                {
                    label: "新聞數量",
                    fill: true,
                    lineTension: 0.5,
                    backgroundColor: "rgba(134, 77, 217, 0.88)",
                    borderColor: "rgba(134, 77, 217, 088)",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    borderWidth: 1,
                    pointBorderColor: "rgba(134, 77, 217, 0.88)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(134, 77, 217, 0.88)",
                    pointHoverBorderColor: "rgba(134, 77, 217, 0.88)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [],
                    spanGaps: false,
                }
            ],
        },
    });

    // 關鍵字類別選項框、按類統計初始
    fetch('/top/api/get-categories/')
        .then(response => response.json())
        .then(data => {

            selectElement.innerHTML = ""; // 清空原有
            tbody_clear();

            let first_get_selected = true;
            data.categories.forEach(category => {
                let option = document.createElement("option");
                if (first_get_selected) { option.selected = true; }
                first_get_selected = false;
                option.value = category;
                option.textContent = category;
                selectElement.appendChild(option);
                tbody_category(category);
            });
        })
        .catch(error => console.error("Error fetching categories:", error));

    // 兩個Table_清空
    function tbody_clear() {
        newsCount_tbody.innerHTML = "";
        wordCount_tbody.innerHTML = "";
    }

    // 兩個Table_初始化類別
    function tbody_category(category) {
        let rowA = newsCount_tbody.insertRow();
        let rowB = wordCount_tbody.insertRow();
        rowA.insertCell(0).innerText = category
        rowA.insertCell(1).innerText = ""
        rowB.insertCell(0).innerText = category
        rowB.insertCell(1).innerText = ""
    }

    // fetch.請求資料並動作
    function interest_sendRequest() {
        let category = selectElement.value;
        let cond = document.querySelector('input[name="search_type"]:checked').id || "and"
        let user_keywords = document.getElementById("tagsInput").value
        fetch("/advanced_search/api/interest-data/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },

            body: JSON.stringify({ user_keywords: user_keywords, cond: cond, category: category, weeks: weeks })

        })
            .then(response => response.json())
            .then(data => {
                let date = data.date;
                let y = data.y;
                let wordCount = data.wordCount;
                let newsCount = data.newsCount;
                window.top.myChart.data.labels = date;
                window.top.myChart.data.datasets[0].data = y;
                window.top.myChart.update();
                for (let i = 0; i < wordCount.length; i++) {
                    newsCount_tbody.rows[i].cells[1].innerText = newsCount[i];
                    wordCount_tbody.rows[i].cells[1].innerText = wordCount[i];
                }
            })
            .catch(error => console.error("❗js錯誤:", error));
    }

    // 事件.當按下查詢按鈕時
    document.getElementById("interest_submit").addEventListener("click", function () {
        interest_sendRequest()
    });

    // 事件.當按下清空按鈕時
    document.getElementById("interest_del").addEventListener("click", function () {
        tagsInput.removeActiveItems();
    });

    // 事件.當滑桿end時
    stepSlider.noUiSlider.on("change", function (values, handle) {
        weeks = values[handle] || 1;

    });
})