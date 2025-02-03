pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = "docker-compose.yaml"
        CREDENTIALS_ID = "udesoft-token"
        REPO_URL = "https://github.com/Unidad-Desarrollo-Software-Empresarial/frontend-sistema-administrativo.git"
    }

    stages {
        stage('Checkout'){
            steps {
                checkout([$class: 'GitSCM',
                            branches: [[name: '*/qa']],
                            doGenerateSubmoduleConfigurations: false,
                            extensions: [],
                            submoduleCfg: [],
                            userRemoteConfigs: [[url: "${REPO_URL}", "credentialsId": "udesof"]]
                        ])
            }
        }

        stage('Diagnose'){
            steps {
                sh 'echo $PATH'
                sh 'which git'
                sh 'docker -v'
            }
        }

        stage('Build'){
            steps{
                echo "Starting docker compose build"
                sh "docker compose build"
                echo "Ending docker compose build"
            }
        }

        stage('Deploy'){
            steps{
                echo "Starting deploy"
                sh "docker compose up -d"
            }
        }

        stage('Clean post-build'){
            steps{
                echo "Starting cleaning"
                sh "docker system prune -a -f"
            }
        }

    }
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Deployment <Sistema administrativo> was successful!'
        }
        failure {
            echo 'Deployment failed'
        }
    }
}