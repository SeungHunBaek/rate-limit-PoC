FROM node:16-alpine

# Install Packages
# RUN apt-get update -y && apt-get upgrade -y
# RUN apt-get install -y \
#       sudo \
#       nodejs

# 앱 디렉터리 생성
WORKDIR /app

# 앱 의존성 설치
COPY package*.json ./

RUN npm install

# 앱 소스 추가
COPY . /app

EXPOSE 3000
CMD [ "node", "src/app.js" ]