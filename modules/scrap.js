const cheerio = require("cheerio")
const axios = require("axios")
const base_url = 'https://www.imdb.com/'

// Change poster size action
    const changePosterSize = (poster, x, y, callback) => {
        callback(poster.slice(0, poster.indexOf('._V1')) + `._V1_UY${y}_CR1,0,${x},${y}_AL_.jpg`)
    }

// Search methods
    function searchByTitle(imdbId, callback) {
        new Promise(async (resolve, reject) => {
            // Get dom html and load cheerio
                const html = await axios.get(base_url + 'title/' + imdbId + '/')
                const $ = cheerio.load(html.data)

            // Get content information
                const data = {
                    title: $('.fjPRnj h1').text(),
                    poster: $('.ipc-media img').attr('src'),
                    rating:  $('.jGRxWM').text().length >= 3 ? $('.jGRxWM').text().slice(0, 3) : $('.jGRxWM').text(),
                    description: $('.gXUyNh').text(),
                    genres: [],
                }

            // Check data status
                if (data.title == '' || data.title == null || data.title == undefined) {
                    reject('Sorry, No result')
                    return
                }

            // Change data info action
                function changeDataInfo() {
                    changePosterSize(data.poster, 650, 700, poster_src => data.poster = poster_src)
                    $('.bYNgQ').each((i, genre) => {
                        data.genres.push($(genre).text())
                    })

                    // Set film makers info
                        const get_list = $('.ipc-metadata-list--baseAlt li')
                        var film_makers = {}

                    get_list.each((i, list) => {
                        // Get list html data and load cheerio
                            const list_html = cheerio.load(list)

                        // Set film_makers object
                            const keys = list_html('.ipc-metadata-list-item__label').text().toLowerCase()
                            var values = []

                            list_html('.ipc-inline-list__item').each((j, value) => values.push(value.children[0].children[0].data))
                            film_makers[keys] = values
                            delete film_makers['']
                    })

                        // Merge new info on data
                            data.film_makers = film_makers
                }
                changeDataInfo()

            resolve(data)
        })
            .then(
                info => callback(info),
                error => callback(error)
            )
    }
    
    function searchByName(title, callback) {
        new Promise(async (resolve, reject) => {
            var data = []

            // Get dom html and load cheerio
                const html = await axios.get(`${base_url}find?q=${title}&s=tt&ttype=ft&ref_=fn_ft`)
                const dom = cheerio.load(html.data)

            // Set info on data
                function setData() {
                    dom('.findResult').each((i, list) => {
                        // Get list html and load cheerio
                            const list_childs = cheerio.load(list)

                        // Get content information
                            data.push({
                                title: list_childs('.result_text a').text(),
                                poster: list_childs('.primary_photo img').attr('src'),
                                release: list_childs('.result_text').text(),
                                id: list_childs('.result_text a').attr('href').match(/tt+\d+/)
                            })

                    })
                }
            setData()

            // Change data info action
                function changeDataInfo() {
                    for (let i = 0; i < data.length; i++) {
                        changePosterSize(data[i].poster, 600, 908, poster => data[i].poster = poster)
                    }
                }
            changeDataInfo()

            // Check data status
                if (data == '' || data == null || data == undefined) reject('Sorry, no result')
                else resolve(data)
        })
            .then(
                data => callback(data),
                error => callback(error)
            )
    }

    function advancedSearch(query, callback) {
        new Promise(async (resolve, reject) => {
            var data = []
            var search_query = ''
            const keys = Object.keys(query)
            const values = Object.values(query)

            //Url query to string
                for (let i = 0; i < keys.length; i++) search_query += `${keys[i]}=${values[i]}&`

            // Get dom html and load cheerio
                const html = await axios.get(`${base_url}search/title/?${search_query}`)
                const dom = cheerio.load(html.data)

            // Set info on data
                function setData() {
                    dom('.lister-item').each((i, list) => {
                        // Get list html and load cheerio
                            const list_childs = cheerio.load(list)

                        // Get content information
                            data.push({
                                title: list_childs(' .lister-item-header a').text(),
                                poster: list_childs('.lister-item-image img').attr('loadlate'),
                                genres: list_childs('.genre').text(),
                                rating: list_childs('.ratings-imdb-rating').text(),
                                description: list_childs('p:nth-child(4)').text(),
                                time: list_childs('.runtime').text(),
                                release: list_childs('.lister-item-year').text().match(/[0-9]+/),
                                id: list_childs('.lister-item-image img').attr('data-tconst')
                            })

                    })
                }
                setData()

            // Change data info action
                function changeDataInfo() {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].rate == undefined ||
                            data[i].rate == '' ||
                            data[i].rate == null) data.splice(i, 1)

                        changePosterSize(data[i].poster, 600, 908, poster => data[i].poster = poster)
                        data[i].genres = JSON.parse(JSON.stringify(data[i].genres.split(',')))
                        data[i].release = data[i].release[0]
                    }
                }
                changeDataInfo()

            // Check data status
                if (data == '' || data == null || data == undefined) reject('Sorry, no result')
                else resolve(data)
        })
            .then(
                data => callback(data),
                error => callback(error)
            )
    }

module.exports = {
    searchByName,
    searchByTitle,
    advancedSearch
}
