import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EventosController {
    public eventos = {
        1: {
            id: 1,
            nome: "Esportes"
        },
        2: {
            id: 2,
            nome: "Dança",
        }
    }

    public async index({view} : HttpContextContract) {
        return view.render('evento/home', { eventos : this.eventos })
    }

    public async criarEvento({view} : HttpContextContract) {
        return view.render('evento/criarEvento')
    }

}
