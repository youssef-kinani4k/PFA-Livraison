pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "docker.io"
        IMAGE_FRONT = "livraison-front"
        IMAGE_BACK = "livraison-backend"
    }

    tools {
        maven 'Maven'
        nodejs 'NodeJS'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/youssef-kinani4k/PFA-Livraison.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Tests') {
            steps {
                dir('backend') {
                    sh 'mvn test'
                }
            }
        }

        stage('Docker Build Images') {
            steps {
                sh 'docker build -t $IMAGE_BACK ./livraison'
                sh 'docker build -t $IMAGE_FRONT ./front'
            }
        }

        stage('Docker Compose Deploy') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d --build'
            }
        }
    }

    post {
        success {
            echo 'Déploiement réussi'
        }
        failure {
            echo 'Échec du pipeline'
        }
    }
}
