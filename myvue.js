let app = new Vue({
    el: '#app',
    data: {
        api: "PqTFeg02GO4ukCYjcKJKQj5peySoLt3lWCEbCWTB",
        url: "",
        path: window.location.pathname,
        miembros: [],
        filterParty: [],
        statelist: "all",
        numD: 0,
        numR: 0,
        numI: 0,
        votesD: 0,
        votesR: 0,
        votesI: 0,
        votestotal: 0,
        masPresente: [],
        menosPresente: [],
        masLeal: [],
        menosLeal: [],
    },
    methods: {
        getmiembros: function () {
            fetch(this.url, {
                method: 'GET',
                headers: new Headers({
                    'X-API-Key': this.api,
                })
            })
                .then((resp) => resp.json())
                .then(data => {
                    app.miembros = data.results[0].members;
                    app.arrayOfPresents = app.miembros.filter(miembro => miembro.total_votes != 0);
                    // array para excluir de los calculos a los "delegados" sin derecho al voto (de territorios como Guam)
                    app.getPresente();
                    app.getMenosPresente();
                    app.getMasPresente();
                    app.getMenosLeal();
                    app.getMasLeal();
                }).catch(err => console.log(err))
        },
        loadmiembros: function () {
            if (this.path.includes('/senate')) {
                return this.url = "https://api.propublica.org/congress/v1/113/senate/members.json"
            } else if (this.path.includes('/house')) {
                return this.url = "https://api.propublica.org/congress/v1/113/house/members.json"
            }
        },

        getPresente() {

            for (var i = 0; i < app.miembros.length; i++) {
                app.votestotal += this.miembros[i].votes_with_party_pct;
                switch (this.miembros[i].party) {
                    case "R":
                        app.numR += 1;
                        app.votesR += this.miembros[i].votes_with_party_pct;
                        break;
                    case "D":
                        app.numD += 1;
                        app.votesD += this.miembros[i].votes_with_party_pct;
                        break;
                    case "I":
                        app.numI += 1;
                        app.votesI += this.miembros[i].votes_with_party_pct;
                        break;
                }
            }
            app.votesD = (app.votesD / app.numD).toFixed(2) + "%"; //decimales
            app.votesR = (app.votesR / app.numR).toFixed(2) + "%";
            if (app.votesI != 0) {
                app.votesI = (app.votesI / app.numI).toFixed(2) + "%";
            } else {
                app.votesI = "N/A";
            }
            app.votestotal = (app.votestotal / this.miembros.length).toFixed(2) + "%";
        },

        getMenosPresente() {
            var orderArr = app.arrayOfPresents.sort(function (a, b) {
                return b.missed_votes_pct - a.missed_votes_pct
            })
            var orderMissedArr = [];
            for (i = 0; i < orderArr.length; i++) {
                if (i < Math.floor(orderArr.length / 10)) {
                    orderMissedArr.push(orderArr[i]);       //push en el límite del 10% para incluir repetidos
                } else if (orderArr[i].missed_votes_pct == orderArr[i - 1].missed_votes_pct) {
                    orderMissedArr.push(orderArr[i]);
                } else {
                    break;
                }
                app.menosPresente[i] = orderArr[i]
                app.menosPresente[i].missed_votes_pct = app.menosPresente[i].missed_votes_pct.toFixed(2)
            }
        },


        getMasPresente() {
            var orderArr = app.arrayOfPresents.sort(function (a, b) {
                return a.missed_votes_pct - b.missed_votes_pct
            })
            var orderMissedArr = [];

            for (i = 0; i < orderArr.length; i++) {
                if (i < Math.floor(orderArr.length / 10)) {
                    orderMissedArr.push(orderArr[i]);      //push en el límite del 10% para incluir repetidos
                } else if (orderArr[i].missed_votes_pct == orderArr[i - 1].missed_votes_pct) {
                    orderMissedArr.push(orderArr[i]);
                } else {
                    break;
                }
                app.masPresente[i] = orderArr[i]
                app.masPresente[i].missed_votes_pct = app.masPresente[i].missed_votes_pct.toFixed(2)
            }
        },

        getMenosLeal() {
            var orderArr = app.arrayOfPresents.sort(function (a, b) {
                return a.votes_with_party_pct - b.votes_with_party_pct
            })
            var orderWPartyArr = [];

            for (i = 0; i < orderArr.length; i++) {
                if (i < Math.floor(orderArr.length / 10)) {
                    orderWPartyArr.push(orderArr[i]);      //push en el límite del 10% para incluir repetidos
                } else if (orderArr[i].votes_with_party_pct == orderArr[i - 1].votes_with_party_pct) {
                    orderWPartyArr.push(orderArr[i]);
                } else {
                    break;
                }
                app.menosLeal[i] = orderArr[i]
                app.menosLeal[i].votes_with_party_pct = app.menosLeal[i].votes_with_party_pct.toFixed(2)
                app.menosLeal[i].partyvotes = Math.round((app.menosLeal[i].total_votes-app.menosLeal[i].missed_votes)*app.menosLeal[i].votes_with_party_pct/100)
            }
        },

        
        getMasLeal() {
            var orderArr = app.arrayOfPresents.sort(function (a, b) {
                return b.votes_with_party_pct - a.votes_with_party_pct
            })
            var orderWPartyArr = [];

            for (i = 0; i < orderArr.length; i++) {
                if (i < Math.floor(orderArr.length / 10)) {
                    orderWPartyArr.push(orderArr[i]);      //push en el límite del 10% para incluir repetidos
                } else if (orderArr[i].votes_with_party_pct == orderArr[i - 1].votes_with_party_pct) {
                    orderWPartyArr.push(orderArr[i]);
                } else {
                    break;
                }
                app.masLeal[i] = orderArr[i]
                app.masLeal[i].votes_with_party_pct = app.masLeal[i].votes_with_party_pct.toFixed(2)
                app.masLeal[i].partyvotes = Math.round((app.masLeal[i].total_votes-app.masLeal[i].missed_votes)*app.masLeal[i].votes_with_party_pct/100)
            }
        },
    },
    computed: {
        filterArray() {
            return this.miembros.filter((check) => ((this.filterParty.includes(check.party) || this.filterParty.length == 0)) && ((this.statelist == check.state) || (this.statelist == "all")))
        },
        stateArray() {
            return [...new Set(this.miembros.map(est => est.state))].sort();
        },
    },
    created() {
        this.loadmiembros();
        this.getmiembros();
    },
})