import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EventosController {
    public eventos = {
        1: {
            id: 1,
            nome: "Violino",
            descricao: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu scelerisque felis imperdiet proin fermentum leo vel. Ultrices tincidunt arcu non sodales neque. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Purus sit amet volutpat consequat mauris. Commodo ullamcorper a lacus vestibulum sed arcu non odio. A iaculis at erat pellentesque adipiscing commodo elit.",
            foto: "images/eventos/evento-violino.jpg",
            data: "30/02/2022",
            participantes: 11,
            organizador: "Ciclano D. Tal",
            local: "Auditório"
        },
        2: {
            id: 2,
            nome: "Dança",
            descricao: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu scelerisque felis imperdiet proin fermentum leo vel. Ultrices tincidunt arcu non sodales neque. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Purus sit amet volutpat consequat mauris. Commodo ullamcorper a lacus vestibulum sed arcu non odio. A iaculis at erat pellentesque adipiscing commodo elit.",
            foto: "images/eventos/evento-danca.jpg",
            data: "30/03/2022",
            participantes: 15,
            organizador: "Ciclana D. Tal",
            local: "Salão de dança"
        },
        3: {
            id: 3,
            nome: "Esportes",
            descricao: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu scelerisque felis imperdiet proin fermentum leo vel. Ultrices tincidunt arcu non sodales neque. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Purus sit amet volutpat consequat mauris. Commodo ullamcorper a lacus vestibulum sed arcu non odio. A iaculis at erat pellentesque adipiscing commodo elit.",
            foto: "images/eventos/evento-esporte.jpg",
            data: "30/04/2022",
            participantes: 20,
            organizador: "Fulana D. Tal",
            local: "Quadra"
        }
    }

    public usuario = { 
        foto: "images/usuarios/estudante.jpg", 
        nome: "Fulano D. Tal", 
        curso: "Ciência da Computação", 
        campus: "Nova Iguaçu - IM", 
        certificados: 32, 
        eventosCriados: 11,
        preferencias: this.eventos
    }

    public eventoPrincipal = this.eventos[1];

    public categoriasEvento = {
        1: {
            id: 1,
            nome: "Aulas de Basquete"
        },
        2: {
            id: 2,
            nome: "Aulas de corrida e Yoga"
        },
        3: {
            id: 3,
            nome: "Campeonatos de dança e aulas de Ritmo"
        },
        4: {
            id: 4,
            nome: "Campeonatos de Tênis de Mesa"
        },
        5: {
            id: 5,
            nome: "Jogos/Aulas de Handebol"
        }
    }

    public async index({view} : HttpContextContract) {
        return view.render('evento/home', { eventos : this.eventos, usuario : this.usuario, eventoPrincipal : this.eventoPrincipal })
    }

    public async criarEvento({view} : HttpContextContract) {
        return view.render('evento/criarEvento', { categorias: this.categoriasEvento })
    }

}
