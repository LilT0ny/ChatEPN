pipeline {
    agent any

    environment {
        // Nombre de la imagen Docker
        IMAGE_NAME = 'chatepn'
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Build') {
            steps {
                // VITE_BASE=/ para producción en un servidor raíz
                sh 'VITE_BASE=/ npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                sh """
                    docker build \
                        --build-arg VITE_BASE=/ \
                        -t ${IMAGE_NAME}:${IMAGE_TAG} \
                        -t ${IMAGE_NAME}:latest \
                        .
                """
            }
        }

        stage('Docker Run (smoke test)') {
            steps {
                script {
                    // Levanta el contenedor en un puerto temporal y verifica que responde HTTP 200
                    sh "docker run -d --name ${IMAGE_NAME}_test -p 9090:80 ${IMAGE_NAME}:${IMAGE_TAG}"
                    sleep(time: 5, unit: 'SECONDS')
                    sh "curl --fail --silent http://localhost:9090/ || (docker logs ${IMAGE_NAME}_test; exit 1)"
                }
            }
            post {
                always {
                    sh "docker stop ${IMAGE_NAME}_test || true"
                    sh "docker rm   ${IMAGE_NAME}_test || true"
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo '🚀 Deploying...'
                // Detiene el contenedor anterior (si existe) y lanza el nuevo
                sh """
                    docker stop ${IMAGE_NAME} || true
                    docker rm   ${IMAGE_NAME} || true
                    docker run -d \
                        --name ${IMAGE_NAME} \
                        --restart unless-stopped \
                        -p 3000:80 \
                        ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completado — imagen: ${IMAGE_NAME}:${IMAGE_TAG}"
        }
        failure {
            echo '❌ Pipeline fallido. Revisar los logs.'
        }
        cleanup {
            // Limpia imágenes antiguas (conserva las últimas 3)
            sh "docker image prune -f || true"
        }
    }
}
