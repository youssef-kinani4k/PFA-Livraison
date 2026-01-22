#  NextWay

NextWay est une application **full-stack** de gestion et d’optimisation de livraison, basée sur une architecture moderne **microservices / conteneurisée**.

Le projet combine :

* **Frontend** : React (Vite)
* **Backend** : Spring Boot
* **Bases de données** : MySQL & MongoDB
* **Sécurité** : Spring Security + JWT
* **DevOps** : Docker, Docker Compose, Jenkins

---

##  Architecture générale

```
nextway/
│
├── livraison/              # Application Spring Boot
│   ├── src/
│   └── Dockerfile
│
├── front/             # Application React (Vite)
│   ├── src/
│   └── Dockerfile
│
├── docker-compose.yml    # Orchestration des services
├── Jenkinsfile           # Pipeline CI/CD
└── README.md
```

---

##  Technologies utilisées

###  Backend (Spring Boot)

* Java 17
* Spring Boot 3.5.0
* Spring Web
* Spring Data JPA (MySQL)
* Spring Data MongoDB
* Spring Security
* JWT (Json Web Token)
* Validation (Hibernate Validator)
* Lombok
* Google OR-Tools (optimisation des tournées)

###  Frontend (React)

* React 19
* Vite
* React Router DOM
* Axios
* Bootstrap / React-Bootstrap
* Leaflet & React-Leaflet (cartographie)
* Formik & Yup (formulaires et validation)
* JWT Decode

###  Bases de données

* **MySQL** : données relationnelles (utilisateurs, livraisons, commandes, etc.)
* **MongoDB** : données non relationnelles (tracking, logs, historique, etc.)

###  DevOps & CI/CD

* Docker
* Docker Compose
* Jenkins

---

##  Sécurité

L’application utilise une authentification basée sur **JWT** :

* Login avec génération de token
* Transmission du token via les headers HTTP (`Authorization: Bearer <token>`)
* Sécurisation des endpoints avec Spring Security

---

##  Docker & Docker Compose

Tous les services sont conteneurisés :

* Backend Spring Boot
* Frontend React
* MySQL
* MongoDB

### Lancer l’application avec Docker

```bash
docker-compose up --build
```

Une fois lancé :

* Frontend : [http://localhost:5173](http://localhost:5173)
* Backend : [http://localhost:8080](http://localhost:8080)
* MySQL : localhost:3306
* MongoDB : link cluster

---

##  CI/CD avec Jenkins

Le projet intègre un pipeline Jenkins permettant :

1. Clonage du projet
2. Build du backend avec Maven
3. Build du frontend avec Node/Vite
4. Exécution des tests
5. Création des images Docker
6. Déploiement via Docker Compose

---

##  Tests

### Backend

* Spring Boot Test
* Spring Security Test

```bash
mvn test
```

### Frontend

```bash
npm run lint
```

---

##  Lancement en mode développement

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

##  Prérequis

* Java 17+
* Node.js 18+
* Docker & Docker Compose
* Maven
* Jenkins 

---

##  Auteurs

Projet réalisé dans le cadre d’un **PFA**.

---

## Licence

Ce projet est à usage pédagogique.

---

 *NextWay – Smart Delivery, Better Routes* 
