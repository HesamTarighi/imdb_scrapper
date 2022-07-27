const osmosis = require("osmosis");
const base_url = 'https://www.imdb.com/'

const changeCoverSize = (cover, x, y, callback) => {
    callback(cover.slice(0, cover.indexOf('._V1')) + `._V1_UY${y}_CR1,0,${x},${y}_AL_.jpg`)
}

//Search methods
    const searchById = (imdbId, callback) => {
        new Promise((resolve, reject) => {
            osmosis
                .get(base_url + 'title/' + imdbId + '/')
                .set({
                    title: '.khmuXj h1',
                    cover: '.ipc-media img@src',
                    rating: '.jGRxWM',
                    genres: '.ipc-chip-list__scroller a',
                    description: '.gXUyNh',
                })
                .data(info => {
                    if (info == '' || info == null || info == undefined) reject('Sorry, no result')
                    else resolve(info)
                })
        })
            .then(
                info => callback(info),
                error => callback(error)
            )
    }
    const advancedSearch = (query, callback) => {
        var data = []
        var search_query = ''
        const keys = Object.keys(query)
        const values = Object.values(query)

        //Url query to string
            for (let i = 0; i < keys.length; i++) search_query += `${keys[i]}=${values[i]}&`

        new Promise(async (resolve, reject) => {
            await osmosis
                .get(`${base_url}search/title/?${search_query}`)
                .find('.lister-item')
                .set({
                    title: '.lister-item-header a',
                    cover: '.lister-item-image img@loadlate',
                    genres: '.genre',
                    rate: '.ratings-imdb-rating',
                    description: 'p:nth-child(4)',
                    time: '.runtime',
                    release: '.lister-item-year',
                    id: '.lister-item-image img@data-tconst'
                })
                .data(info => {
                    changeCoverSize(info.cover, 600, 908, cover => info.cover = cover)
                    info.genres = JSON.stringify(info.genres.split(','))
                    info.release = info.release.slice(1, 5)
                    data.push(info)
                })
                .done(() => {
                    if (data == '' || data == null || data == undefined) reject('Sorry, no result')
                    else resolve()
                })
        })
            .then(
                () => callback(data),
                error => callback(error)
            )

    }

module.exports = {
    searchById,
    advancedSearch
}
