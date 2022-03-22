import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MuralController {
    public murais = {
        1: {
            id: 1,
            nome: "Aulas de Basquete",
            foto: "images/mural/basquete.jpg", 
            participantes: 3212,
        },
        2: {
            id: 2,
            nome: "Aulas de alongamento e corrida",
            foto: "images/mural/corrida.jpg", 
            participantes: 1212,
        },
        3: {
            id: 3,
            nome: "Grupo de dança e ritmo",
            foto: "images/mural/dança.jpg",
            participantes: 568,
        },
        4: {
            id: 4,
            nome: "Jogos/Aulas de Handebol",
            foto: "images/mural/handebol.jpg",
            participantes: 568,
        },
        5: {
            id: 5,
            nome: "Campeonato de Tênis de Mesa",
            foto: "images/mural/tenis de mesa.jpg",
            participantes: 568,
        }
    }
    public async Murais({view} : HttpContextContract) {
        return view.render('mural/Murais', { murais : this.murais })
    }
}