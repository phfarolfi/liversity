import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Event from 'App/Models/Event'
import Database from '@ioc:Adonis/Lucid/Database'
import Student from 'App/Models/Student'
import EventOrganizer from 'App/Models/EventOrganizer'
import Campus from 'App/Models/Campus'

export default class EventsController {
    public events = {
        1: {
            id: 1,
            name: "Violino",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu scelerisque felis imperdiet proin fermentum leo vel. Ultrices tincidunt arcu non sodales neque. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Purus sit amet volutpat consequat mauris. Commodo ullamcorper a lacus vestibulum sed arcu non odio. A iaculis at erat pellentesque adipiscing commodo elit.",
            photo: "images/events/evento-violino.jpg",
            date: "30/02/2022",
            subscribersNumber: 5,
            organizer: "Ciclano D. Tal",
            local: "Auditório"
        },
        2: {
            id: 2,
            name: "Dança",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu scelerisque felis imperdiet proin fermentum leo vel. Ultrices tincidunt arcu non sodales neque. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Purus sit amet volutpat consequat mauris. Commodo ullamcorper a lacus vestibulum sed arcu non odio. A iaculis at erat pellentesque adipiscing commodo elit.",
            photo: "images/events/evento-danca.jpg",
            date: "30/03/2022",
            subscribersNumber: 15,
            organizer: "Ciclana D. Tal",
            local: "Salão de dança"
        },
        3: {
            id: 3,
            name: "Esportes",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu scelerisque felis imperdiet proin fermentum leo vel. Ultrices tincidunt arcu non sodales neque. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Purus sit amet volutpat consequat mauris. Commodo ullamcorper a lacus vestibulum sed arcu non odio. A iaculis at erat pellentesque adipiscing commodo elit.",
            photo: "images/events/evento-esporte.jpg",
            date: "30/04/2022",
            subscribersNumber: 20,
            organizer: "Fulana D. Tal",
            local: "Quadra"
        }
    }

    public subscribers = {
        1: {
            id: 1,
            photo: "images/users/estudante.jpg", 
            name: "Fulano D. Tal", 
            course: "Ciência da Computação", 
            campus: "Nova Iguaçu - IM", 
            certificatesNumber: 32, 
            eventsCreated: 11,
            preferences: this.events
        },
        2: {
            id: 2,
            photo: "images/users/estudante.jpg", 
            name: "Fulano D. Tal", 
            course: "Ciência da Computação", 
            campus: "Nova Iguaçu - IM", 
            certificatesNumber: 32, 
            eventsCreated: 11,
            preferences: this.events
        },
        3: {
            id: 3,
            photo: "images/users/estudante.jpg", 
            name: "Fulano D. Tal", 
            course: "Ciência da Computação", 
            campus: "Nova Iguaçu - IM", 
            certificatesNumber: 32, 
            eventsCreated: 11,
            preferences: this.events
        },
        4: {
            id: 4,
            photo: "images/users/estudante.jpg", 
            name: "Fulano D. Tal", 
            course: "Ciência da Computação", 
            campus: "Nova Iguaçu - IM", 
            certificatesNumber: 32, 
            eventsCreated: 11,
            preferences: this.events
        },
        5: {
            id: 5,
            photo: "images/users/estudante.jpg", 
            name: "Fulano D. Tal", 
            course: "Ciência da Computação", 
            campus: "Nova Iguaçu - IM", 
            certificatesNumber: 32, 
            eventsCreated: 11,
            preferences: this.events
        }
    }

    public mainEvent = this.events[1];

    public eventCategories = {
        1: {
            id: 1,
            name: "Aulas de Basquete"
        },
        2: {
            id: 2,
            name: "Aulas de corrida e Yoga"
        },
        3: {
            id: 3,
            name: "Campeonatos de dança e aulas de Ritmo"
        },
        4: {
            id: 4,
            name: "Campeonatos de Tênis de Mesa"
        },
        5: {
            id: 5,
            name: "Jogos/Aulas de Handebol"
        }
    }

    public async index({auth, view, response} : HttpContextContract) {
        //landing page (homepage)
        var userId = auth.user!.id;
        var events: any[] = []
        var firstEvent: any = {}
        var nextEvents: any[] = []
        var interests: any[] = []
        var participantsAmount = 0
        var eventOrganizer = ''
        var nullPhoto = 'https://liversity-app.s3.amazonaws.com/students/photo/default-profile.jpg'

        var student = await Database
        .from('students')
        .join('users', (query) => {
          query.on('students.user_id', '=', 'users.id')
        })
        .whereRaw('users.id = ?', [userId])
        .select('students.*')
        .select('users.name')
        .firstOrFail()

        if(student) {
            if(student.campus_id) {
                var studentCampus = await Campus.findByOrFail('id', student.campus_id)
                if(studentCampus) {
                    console.log(studentCampus)
                    var studentCampusName = studentCampus?.$attributes.name
                }
            }

            var certificatesNumber = await Database
            .from('event_subscriptions')
            .whereRaw('student_id = ?', [student.id])
            .andWhereRaw('presenca = ?', ['PRESENTE'])
            .count('presenca')
            .firstOrFail()
            certificatesNumber = certificatesNumber['count(`presenca`)'];

            var eventsCreatedNumber = await Database
            .from('event_organizers')
            .whereRaw('user_id = ?', [userId])
            .count('event_id')
            .firstOrFail()
            eventsCreatedNumber = eventsCreatedNumber['count(`event_id`)'];

            interests = await Database
            .from('interests')
            .join('categories', (query) => {
              query.on('interests.category_id', '=', 'categories.id')
            })
            .whereRaw('interests.student_id = ?', [student!.id])
            .select('categories.id')
            .select('categories.name')

            events = await Database
            .from('event_subscriptions')
            .join('events', (query) => {
              query.on('event_subscriptions.event_id', '=', 'events.id')
            })
            .whereRaw('event_subscriptions.student_id = ?', [student.id])
            .select('events.*')
            .select('event_subscriptions.id')
            .limit(4)

            if(events.length > 0) {
                firstEvent = events[0]
                if(events.length > 1) 
                    nextEvents = events.slice(1)
    
                participantsAmount = await Database
                .from('event_subscriptions')
                .whereRaw('event_id = ?', [firstEvent.event_id])
                .count('student_id')
                .firstOrFail()

                eventOrganizer = await Database
                .from('users')
                .join('event_organizers', (query) => {
                  query.on('users.id', '=', 'event_organizers.user_id')
                })
                .whereRaw('event_organizers.event_id = ?', [firstEvent.event_id])
                .select('users.name')
                .firstOrFail()
            }
        }
        return view.render('account/landingPage', { 
                nullPhoto : nullPhoto, student : student, studentCampus : studentCampusName, 
                events : events, firstEvent : firstEvent, nextEvents : nextEvents, interests: interests,
                numberCertificates : certificatesNumber, numberEventsCreated : eventsCreatedNumber,
                numberParticipants: participantsAmount, organizer: eventOrganizer })
    }

    public async createEventView({ auth, response, view } : HttpContextContract) {
        return view.render('events/createEvent')
    }

    public async createEvent({auth, request, response, session} : HttpContextContract) {
        const { name, eventDate, category,  limitSubscriptionDate , description, linkCommunicationGroup /*,photo, document*/ } = request.all()

        if(!name || !eventDate ||  !category || !limitSubscriptionDate || !description || !linkCommunicationGroup /*|| !photo || !document*/) {
            session.flashExcept(['createEvent'])
            session.flash({ errors: { createEvent: 'Preencha todos os campos solicitados' } })
            return response.redirect().toRoute('createEvent.view')
        }

        try {
            var event = await Event.create({ name: name, eventDate: eventDate, initialSubscriptionDate: new Date(), 
                limitSubscriptionDate: limitSubscriptionDate, description: description, categoryId:category, 
                local:'Campus', linkCommunicationGroup: linkCommunicationGroup, 
                photo: "https://liversity-app.s3.amazonaws.com/events/photo/andrei-stratu-kcJsQ3PJrYU-unsplash.jpg", 
                document: "https://liversity-app.s3.amazonaws.com/events/photo/andrei-stratu-kcJsQ3PJrYU-unsplash.jpg", 
                campusId: 1, statusId:1 });

            await auth.check()
            await EventOrganizer.create({ userId: auth.user!.id, eventId: event.id} )
            response.redirect().toRoute('eventPage.view')
        } catch {
            session.flashExcept(['createEvent'])
            session.flash({ errors: { createEvent: 'Não foi possível realizar o cadastro do evento' } })

            return response.redirect().toRoute('createEvent.view')
        }
    }

    // public async showEvent({view} : HttpContextContract) {
    //     return view.render('events/eventPage', { events : this.events, user : this.user, mainEvent : this.mainEvent, subscribers : this.subscribers})
    // }

    public async eventPageView({ params, view }: HttpContextContract) {
        // const evento = await Event.find(params.id)
        // console.log(evento)
        return view.render('events/eventPage', { events : this.events, user : this.user, mainEvent : this.mainEvent, subscribers : this.subscribers})
    }

    public async showEvents({view} : HttpContextContract) {
        var eventsQuery = await Database.rawQuery(
            'select e.id, e.name, e.photo, e.event_date from events e order by e.event_date')
        var events = eventsQuery.rows
        for(var event of events) {
             var participantsAmountQuery = await Database.rawQuery(
                "select count(student_id) from event_subscriptions es where :column1: = :eventId:",
                {
                    column1: 'es.event_id',
                    eventId: event.id
                }
            )
            event.subscribersNumber = participantsAmountQuery.rows[0].count
        }

        return view.render('events/eventsPage', { events : events })
    }
}
