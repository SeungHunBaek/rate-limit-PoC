# CCXT-rate-limiter

> CCXT request제한

<!-- [![NPM Version][npm-image]][npm-url] -->

## 개발 환경 설정

### Visual Studio Code를 실행하고, '확장 기능'에 들어가서 'ESLint', 'Prettier'를 설치

### 프로젝트에 prettier 패키지 설치(dev-dependencies)

- 환경 설정 ⇨ Default Formatter ⇨ Prettier - Code Formatter

## Code Convention 설정

### ESLint 패키지 설치

- 코드 문법 검사 및 코드 포맷팅을 수행하는 툴 ESLint를 설치

```sh
npm install --save-dev eslint
```

### Prettier 패키지 설치

- 코드 포맷팅만을 집중적으로 수행하는 툴 Prettier 설치

```sh
npm install --save-dev prettier
```

### eslint-config-prettier 패키지 설치

- Prettier 설정과 충돌 나는 ESLint의 설정을 비활성화

```sh
npm install --save-dev eslint-config-prettier
```

### eslint-plugin-prettier 패키지 설치

- ESLint 안에서 Prettier 검사를 실행하도록 설정

```sh
npm install --save-dev eslint-plugin-prettier
```

### ESLint에 Airbnb Style Guide패키지 설치

- ESLint에 Airbnb Style Guide를 적용하기 위한 패키지들 일괄 설치

```sh
npx install-peerdeps --dev eslint-config-airbnb
```

### ESLint 설정 파일(.eslintrc.json) 작성하기

```sh
{
  "extends": ["airbnb", "plugin:prettier/recommended"]
}
"extends" : 이미 구성되어 있는 설정 집합을 불러오는 부분으로, 뒤에 있을수록 우선 적용
"airbnb" : ESLint에 Airbnb Style Guide를 적용
```

### Prettier 설정 파일(.prettierrc) 작성하기

```sh
{
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "none",
  "endOfLine": "auto"
}
"printWidth": 100 : 한 줄의 최대 길이를 100글자로 제한
"singleQuote": true : 문자열 표현 시 작은따옴표를 사용하도록 제한
"trailingComma ": "none" : 트레일링 콤마를 사용하지 않도록 제한
"endOfLine": "auto" : LF 유지

```

## 업데이트 내역

- 0.0.1
  - 작업 진행 중

<!-- Markdown link & img dfn's -->
<!-- [npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square -->
