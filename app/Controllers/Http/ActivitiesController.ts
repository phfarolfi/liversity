import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ActivitiesController {
    public activities = {
        1: {
            id: 1,
            nome: "Aulas de Basquete",
            foto: "images/mural/basquete.jpg", 
            participantes: 3212,
        },
        2: {
            id: 2,
            nome: "Aulas de corrida e Yoga",
            foto: "images/mural/corrida.jpg", 
            participantes: 1212,
        },
        3: {
            id: 3,
            nome: "Campeonatos de dança e aulas de Ritmo",
            foto: "images/mural/dança.jpg",
            participantes: 501,
        },
        4: {
            id: 4,
            nome: "Campeonatos de Tênis de Mesa",
            foto: "images/mural/tenis de mesa.jpg",
            participantes: 568,
        },
        5: {
            id: 5,
            nome: "Jogos/Aulas de Handebol",
            foto: "images/mural/handebol.jpg",
            participantes: 588,
        }
    }
    public async Activities({view} : HttpContextContract) {
        return view.render('mural/Activities', { activities : this.activities })
    }
}
