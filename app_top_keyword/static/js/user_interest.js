document.addEventListener("DOMContentLoaded", function () {
    //初始化
    let tbody = document.getElementById("top_tbody");
    let selectElement = document.getElementById("keyword_select");
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


    // 關鍵字類別選項框初始
    fetch('/top/api/get-categories/')
        .then(response => response.json())
        .then(data => {

            selectElement.innerHTML = ""; // 清空原有
            let first_get_selected = true;
            data.categories.forEach(category => {
                let option = document.createElement("option");
                if (first_get_selected) { option.selected = true; }
                first_get_selected = false;
                option.value = category;
                option.textContent = category;
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching categories:", error));

    // fetch.請求keyword並動作
    function interest_sendRequest() {
        let category = selectElement.value;
        let cond = document.querySelector('input[name="search_type"]:checked').id || "and"
        let user_keywords = document.getElementById("tagsInput").value
        fetch("/top/api/interest-data/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },

            body: JSON.stringify({ user_keywords: user_keywords, cond: cond, category: category, weeks: weeks })

        })
            .then(response => response.json())
            .then(data => {
                let words = data.words;
                let counts = data.counts;
                window.top.myChart.data.labels = words;
                window.top.myChart.data.datasets[0].data = counts;
                window.top.myChart.update();
                tbody.innerHTML = "";
                for (let i = 0; i < words.length; i++) {
                    let row = tbody.insertRow();
                    row.insertCell(0).innerText = i + 1; // 序號
                    row.insertCell(1).innerText = words[i]; // 關鍵字
                    row.insertCell(2).innerText = counts[i]; // 次數
                }
            })
            .catch(error => console.error("❗js錯誤:", error));
    }

    // 事件.當按下查詢按鈕時
    document.getElementById("interest_submit").addEventListener("click", function () {
        interest_sendRequest()
    });

    // 事件.當滑桿end時
    stepSlider.noUiSlider.on("change", function (values, handle) {
        weeks = values[handle] || 1;

    });
})