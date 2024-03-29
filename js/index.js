(function () {

  const BASE_URL = 'https://movie-list.alphacamp.io/';
  const INDEX_URL = BASE_URL + 'api/v1/movies/';
  const POSTER_URL = BASE_URL + 'posters/';
   //電影總清單
  const data = [];

  //搜尋
  const searchForm = document.getElementById('search');
  const searchInput = document.getElementById('search-input');


  //分頁，每頁顯示 12 筆資料
  const pagination = document.getElementById('pagination');
  const ITEM_PER_PAGE = 12;
  let paginationData = [];
  //初始頁
  let newpage = '1';

  //預設顯示樣式
  const cardMode = document.getElementById('cardImg');  
  const listMode = document.getElementById('cardList');
  const changList = document.getElementById('changList');
  let viewMode = 'card';
  let pageData = data;




  //電影清單
  const dataPanel = document.getElementById('data-panel')

  axios.get(INDEX_URL)
    .then((response) => {
      data.push(...response.data.results)
      getTotalPages(data)
      displayDataList(data)
      getPageData(newpage, data)
    })
    // 有錯誤時印出
    .catch((err) => console.log(err))

  //監聽按鈕 事件
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })
  


  changList.addEventListener('click',(even) =>{
    even.preventDefault();
    if(even.target.matches('.fa-th')) {
      viewMode = 'card'
      getTotalPages(pageData)
      getPageData(newpage, pageData)
    }else if (even.target.matches('.fa-bars')) {
      viewMode = 'list'
      displayDataList(pageData)
      getPageData(newpage, pageData)
    }
  })

    // 分頁監聽 事件
    pagination.addEventListener('click', event => {
      // console.log(event.target.dataset.page)
      newpage = event.target.dataset.page
      if (event.target.tagName === 'A') {
        getPageData(newpage)
      }
    })
  


  searchForm.addEventListener('submit', event => {

    event.preventDefault();
    const keyword = searchInput.value.trim().toLowerCase();

    //搜尋清單
    let filteredMovies = []; 


    filteredMovies = data.filter((movie) =>
      movie.title.toLowerCase().includes(keyword)
    )

    if (filteredMovies.length === 0) {
      return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
    }
    displayDataList(filteredMovies)

    pageData = results

    // console.log(results)
    getTotalPages(results)
    getPageData(1, results)
  })






  


  //分頁方法
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData (pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  //搜尋結果的分頁
  searchForm.addEventListener('submit', event => {
    event.preventDefault()

    let results = []
    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    // displayDataList(results)
    getTotalPages(results)
    getPageData(1, results)
  })


  //將資料塞進data-panel
  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      if(viewMode === 'card') {
        htmlContent += `
        <div class="col-sm-3 mb-3">
          <div class="card mb-2 h-100">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h5>
            </div>
            <div class="modal-footer justify-content-center">
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
            <button type="button" class="btn btn-outline-success btn-add-favorite" data-id="${item.id}">+</button>
          </div>
          </div>
        </div>
      `
      dataPanel.innerHTML = htmlContent
      }else if (viewMode === 'list') {

        htmlContent += `
        <div class="col-6">${item.title}</div>
            <div class="col-6 text-right mb-2">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-outline-success btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
          </hr>
      `
      dataPanel.innerHTML = htmlContent
      }
    })
    
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

  //我的最愛
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} 已經擁有!`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} 儲存至我的最愛`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }




  

})()