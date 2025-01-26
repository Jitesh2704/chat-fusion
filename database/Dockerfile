FROM mongo:latest

COPY mongo-replica-init.sh /app/mongo-replica-init.sh
RUN chmod +x /app/mongo-replica-init.sh

ENTRYPOINT ["/app/mongo-replica-init.sh"]
CMD ["mongod"]
