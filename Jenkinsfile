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
                    sh "docker run -d --name ${IMAGE_NAME}_test -p 9091:80 ${IMAGE_NAME}:${IMAGE_TAG}"
                    sleep(time: 5, unit: 'SECONDS')
                    
                    // Verificamos conectividad desde el host (127.0.0.1) o directamente desde el contenedor
                    sh """
                        curl -f -v http://127.0.0.1:9091/ || \
                        docker exec ${IMAGE_NAME}_test wget -q -O - http://127.0.0.1/ > /dev/null || \
                        (docker logs ${IMAGE_NAME}_test; exit 1)
                    """
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
            steps {
                echo "🚀 Deploying branch: ${env.BRANCH_NAME}..."
                // Detiene el contenedor anterior (si existe) y lanza el nuevo
                sh """
                    docker stop ${IMAGE_NAME} || true
                    docker rm   ${IMAGE_NAME} || true
                    docker run -d \
                        --name ${IMAGE_NAME} \
                        --restart unless-stopped \
                        -p 8089:80 \
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
