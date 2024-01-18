docker-compose down && \
docker rmi \
    docker.swaywallet.io/social-recovery-service:latest \
    docker.swaywallet.io/guardian-service:latest \
    docker.swaywallet.io/social-recovery-ui:latest && \
docker volume rm social-recovery-service_postgres