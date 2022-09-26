FROM node:16-alpine

RUN apt-get update \
    && apt-get install -y git \
    && echo "alias ll='ls -alF'" >> /etc/bash.bashrc \
    && echo "alias rm='rm -i'" >> /etc/bash.bashrc \
    && echo "alias cp='cp -i'" >> /etc/bash.bashrc \
    && echo "alias mv='mv -i'" >> /etc/bash.bashrc \
    && ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
    
# 앱 디렉터리 생성
WORKDIR /app

# 앱 의존성 설치
COPY package*.json ./

RUN npm install

# 앱 소스 추가
COPY . /app

EXPOSE 3000
EXPOSE 6379

CMD [ "node", "src/app.js" ]