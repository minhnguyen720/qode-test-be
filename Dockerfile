FROM postgres:17
ENV TZ=Asia/Ho_Chi_Minh
COPY ./init-user-db.sh /docker-entrypoint-initdb.d/init-user-db.sh