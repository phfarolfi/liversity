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

    public user = {
        photo: "images/users/mike.jpg", 
        name: "Maicu Azalski", 
        course: "Ciência da Computação", 
        campus: "Nova Iguaçu - IM", 
        certificatesNumber: 32, 
        eventsCreated: 11,
        preferences: this.events
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
        await auth.use('web').check()
        if(!auth.use('web').isLoggedIn)
            return response.redirect().toRoute('index')

        //landing page
        var userIdAsync = await auth.user?.id
        var userId = userIdAsync != null ? userIdAsync : ''
        
        var studentQuery = await Database.rawQuery(
            ('select s.*, u.name from students s join users u on :column1: = :column2: where :column2: = :userId:') ,
            {
                column1: 's.user_id',
                column2: 'u.id',
                userId: userId
            }
        )
        var student = studentQuery.rows[0]
        var studentId = student.id
        var studentCampus = await Campus.findBy('id', student?.campus_id)
        var studentCampusName = studentCampus?.$attributes.name
        // console.log(student)

        var eventsQuery = await Database.rawQuery(
            'select e.name, e.description, e.local, e.event_date, e.photo, es.event_id from event_subscriptions as es inner join events as e on :column1: = :column2: where :column3: = :studentId: order by e.event_date limit 4',
            {
                column1: 'es.event_id',
                column2: 'e.id',
                column3: 'es.student_id',
                studentId: studentId
            }
        )
        var events = eventsQuery.rows
        // console.log(events)
        var firstEvent = eventsQuery.rows[0]
        var nextEvents = eventsQuery.rows.slice(1)
        
        var certificatesNumberQuery = await Database.rawQuery(
            "select count(presenca) from event_subscriptions es where :column1: = :studentId: and :column2: = ':presenca:'",
            {
                column1: 'es.student_id',
                studentId: studentId,
                column2: 'es.presenca',
                presenca: 'PRESENTE'
            }
        )
        var certificatesNumber = certificatesNumberQuery.rows[0].count

        var eventsCreatedNumberQuery = await Database.rawQuery(
            "select count(event_id) from event_organizers eo where :column1: = :userId:",
            {
                column1: 'eo.user_id',
                userId: userId
            }
        )
        var eventsCreatedNumber = eventsCreatedNumberQuery.rows[0].count

        if(events.length > 0) {
            var participantsAmountQuery = await Database.rawQuery(
                "select count(student_id) from event_subscriptions es where :column1: = :eventId:",
                {
                    column1: 'es.event_id',
                    eventId: events[0].event_id
                }
            )
            var participantsAmount = participantsAmountQuery.rows[0].count
        
            var eventOrganizerQuery = await Database.rawQuery(
                "select u.name from users u join event_organizers eo on :column1: = :column2: join events e on :column3: = :eventId:",
                {
                    column1: 'u.id',
                    column2: 'eo.user_id',
                    column3: 'eo.event_id',
                    eventId: events[0].event_id
                }
            )
            var eventOrganizer = eventOrganizerQuery.rows[0].name
        }
        else { 
            participantsAmount = 0
            eventOrganizer = 0
        }

        var nullPhoto = 'https://liversity-app.s3.amazonaws.com/students/photo/default-profile.jpg'

        return view.render('account/landingPage', { mainEvent : this.mainEvent, user: this.user, 
                                                    nullPhoto : nullPhoto, student : student, studentCampus : studentCampusName, 
                                                    events : events, firstEvent : firstEvent, nextEvents : nextEvents, numberCertificates : certificatesNumber, numberEventsCreated : eventsCreatedNumber,
                                                    numberParticipants: participantsAmount, organizer: eventOrganizer })
    }

    public async createEventView({ auth, response, view } : HttpContextContract) {
        await auth.use('web').check()
        if(!auth.use('web').isLoggedIn)
            return response.redirect().toRoute('index')

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
                photo: "https://liversity-app.s3.amazonaws.com/students/photo/default-profile.jpg", 
                document: "https://liversity-app.s3.amazonaws.com/students/photo/default-profile.jpg", 
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
