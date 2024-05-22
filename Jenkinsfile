pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('tyrepo1-dockerhub')
        DOCKER_IMAGE = 'australia-southeast2-docker.pkg.dev/extreme-braid-420302/sit223/sit223_62hd'
    }

    stages {
        stage('Checkout') {
            steps {
                git(
                    url: 'https://github.com/Tyrepo1/SIT223_6.2HD.git',
                    branch: 'main'
                )
            }
        }
        stage('Build') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }
        stage('Test') {
            steps {
                sh 'docker run --rm $DOCKER_IMAGE npm test'
            }
        }
        stage('Code Quality Analysis') {
            steps {
                sh 'docker run --rm $DOCKER_IMAGE npm run lint'
            }
        }
        stage('Login') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }
        stage('Deploy to Test Environment') {
            steps {
                sh 'docker-compose -f docker-compose.yml up -d'
            }
        }
        stage('Deploy to Production Environment') {
            steps {
                sh 'echo Pushing image to GCP Artifact Registry..'
                sh 'docker push $DOCKER_IMAGE:latest'
                sh 'echo Complete!'
                sh 'echo Authenticating to GCP...'
                withCredentials([file(credentialsId: 'gcp-kubernetes', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]){
                sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'
                sh 'echo Connecting to GCP Kubernetes Cluster...'
                sh 'gcloud container clusters get-credentials my-first-cluster-3 --zone australia-southeast2-a --project extreme-braid-420302'
                sh 'echo Connected!'
                sh 'echo Applying the Kubernetes files...'
                sh 'kubectl apply -f deploy.yml'
                sh 'kubectl apply -f service.yml'
                sh 'echo Applied!'
                sh 'echo Restarting cluster...'
                sh 'kubectl rollout restart deployment nodeappdeployment'
                sh 'echo Docker image deployed to GCP!'
                sh 'kubectl get svc'
                }
            }
        }
    }
}
