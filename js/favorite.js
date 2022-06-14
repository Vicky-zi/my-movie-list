(function () {
    const BASE_URL = 'https://movie-list.alphacamp.io'
    const INDEX_URL = BASE_URL + '/api/v1/movies/'
    const POSTER_URL = BASE_URL + '/posters/'
    const dataPanel = document.getElementById('data-panel')
    const data = JSON.parse(localStorage.getItem('favoriteMovies')) || []

    displayDataList(data)

    dataPanel.addEventListener('click', (event) => {
        if (event.target.matches('.btn-show-movie')) {
            showMovie(event.target.dataset.id)
        } else if (event.target.matches('.btn-remove-favorite')) {
            removeFavoriteItem(event.target.dataset.id)
        }
    })

    function displayDataList(data) {
        let htmlContent = ''
        data.forEach(function (item, index) {
            htmlContent += `
          <div class="col-sm-3">
            <div class="card mb-2">
              <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
              <div class="card-body movie-item-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
                <button class="btn btn-outline-danger btn-remove-favorite" data-id="${item.id}">X</button>
              </div>
            </div>
          </div>
        `
        })
        dataPanel.innerHTML = htmlContent
    }

    function showMovie(id) {
        // get elements
        const modalTitle = document.getElementById('show-movie-title')
        const modalImage = document.getElementById('show-movie-image')
        const modalDate = document.getElementById('show-movie-date')
        const modalDescription = document.getElementById('show-movie-description')

        // set request url
        const url = INDEX_URL + id
        console.log(url)

        // send request to show api
        axios.get(url).then(response => {
            const data = response.data.results
            console.log(data)

            // insert data into modal ui
            modalTitle.textContent = data.title
            modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
            modalDate.textContent = `release at : ${data.release_date}`
            modalDescription.textContent = `${data.description}`
        })
    }

    //刪除按鈕
    function removeFavoriteItem (id) {
        // find movie by id 根據欲刪除電影的id資訊，找出該電影在data中的index，並存成一個變數。
        const index = data.findIndex(item => item.id === Number(id))

        //若找不到該電影，findIndex會回傳-1，用return來結束這個功能，不再執行下面的程式碼
        if (index === -1) return
    
        // 根據該電影的index，用splice的功能在index位置刪除1項item。
        data.splice(index, 1)
        localStorage.setItem('favoriteMovies', JSON.stringify(data))
    
        // 用更新的data重新渲染網頁。
        displayDataList(data)
      }
})()