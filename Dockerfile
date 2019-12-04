FROM alpine

RUN apk add nodejs npm
RUN echo hi

CMD ls