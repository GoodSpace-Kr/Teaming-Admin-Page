# Teaming Admin Page - 배포 가이드

이 문서는 Teaming Admin Page를 Docker 컨테이너로 빌드하고 AWS ECR에 업로드하여 배포하는 방법을 설명합니다.

## 🏗️ 아키텍처 개요

```
Internet → ALB → Nginx (HTTPS) → React App
                    ↓
              Backend APIs
                    ↓
              WebSocket Servers
```

## 📋 사전 요구사항

### 필수 도구
- **Docker** (20.10+)
- **AWS CLI** (2.0+)
- **Node.js** (18+)
- **npm** 또는 **yarn**

### AWS 권한
다음 AWS 권한이 필요합니다:
- ECR (Elastic Container Registry)
- ECS (Elastic Container Service)
- EC2 (VPC, Security Groups, Load Balancer)
- CloudWatch Logs
- IAM (Task Execution Role)

## 🚀 배포 단계

### 1. 환경 설정

```bash
# AWS 자격 증명 설정
aws configure

# 환경 변수 설정
export AWS_REGION="ap-northeast-2"
export ECR_REGISTRY="123456789012"  # AWS 계정 ID
export ECR_REPOSITORY="teaming-admin"
export IMAGE_TAG="latest"
```

### 2. AWS 인프라 설정

```bash
# AWS 리소스 생성 (VPC, ECS 클러스터, ECR 등)
chmod +x scripts/setup-aws.sh
./scripts/setup-aws.sh
```

### 3. Docker 이미지 빌드 및 ECR 업로드

```bash
# React 앱 빌드 및 Docker 이미지 생성, ECR 업로드
chmod +x scripts/build-and-push.sh
./scripts/build-and-push.sh
```

### 4. ECS 배포

```bash
# ECS 서비스 배포
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## 🔧 로컬 개발 환경

### Docker Compose로 로컬 실행

```bash
# 개발 환경 실행
docker-compose up -d

# 프로덕션 환경 실행
docker-compose -f docker-compose.prod.yml up -d
```

### 로컬 테스트

```bash
# HTTP (자동으로 HTTPS로 리다이렉트)
curl http://localhost

# HTTPS
curl -k https://localhost

# 헬스 체크
curl http://localhost/health
```

## 🌐 Nginx 설정 특징

### HTTPS 업그레이드
- 모든 HTTP 요청을 HTTPS로 자동 리다이렉트
- SSL/TLS 1.2, 1.3 지원
- 보안 헤더 자동 추가

### 웹소켓 지원
- `/ws/` 경로로 웹소켓 연결 프록시
- 업스트림 서버로 로드 밸런싱
- 연결 업그레이드 처리

### API 프록시
- `/api/` 경로로 백엔드 API 프록시
- 레이트 리미팅 적용
- 헬스 체크 엔드포인트

## 📊 모니터링 및 로그

### CloudWatch 로그
```bash
# ECS 태스크 로그 확인
aws logs describe-log-groups --log-group-name-prefix "/ecs/"

# 실시간 로그 스트림
aws logs tail /ecs/teaming-admin-task --follow
```

### 헬스 체크
```bash
# ALB 헬스 체크
curl -H "Host: your-domain.com" http://your-alb-dns/health

# ECS 태스크 헬스 체크
aws ecs describe-services --cluster teaming-cluster --services teaming-admin-service
```

## 🔒 보안 설정

### SSL 인증서
```bash
# Let's Encrypt 인증서 (프로덕션)
certbot certonly --nginx -d your-domain.com

# 자체 서명 인증서 (개발)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem \
  -out ssl/cert.pem
```

### 보안 헤더
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options
- X-Content-Type-Options
- Content Security Policy

## 🚨 트러블슈팅

### 일반적인 문제

#### 1. ECR 로그인 실패
```bash
# AWS 자격 증명 확인
aws sts get-caller-identity

# ECR 로그인 재시도
aws ecr get-login-password --region ap-northeast-2 | \
  docker login --username AWS --password-stdin 123456789012.dkr.ecr.ap-northeast-2.amazonaws.com
```

#### 2. ECS 서비스 배포 실패
```bash
# 서비스 상태 확인
aws ecs describe-services --cluster teaming-cluster --services teaming-admin-service

# 태스크 정의 확인
aws ecs describe-task-definition --task-definition teaming-admin-task
```

#### 3. 웹소켓 연결 실패
```bash
# Nginx 설정 확인
docker exec -it teaming-admin-nginx nginx -t

# 웹소켓 업스트림 확인
docker exec -it teaming-admin-nginx cat /etc/nginx/conf.d/default.conf
```

### 로그 확인

#### Nginx 로그
```bash
# 액세스 로그
docker exec -it teaming-admin-nginx tail -f /var/log/nginx/access.log

# 에러 로그
docker exec -it teaming-admin-nginx tail -f /var/log/nginx/error.log
```

#### ECS 태스크 로그
```bash
# CloudWatch 로그 그룹
aws logs describe-log-groups --log-group-name-prefix "/ecs/teaming-admin"

# 로그 스트림
aws logs describe-log-streams --log-group-name "/ecs/teaming-admin-task"
```

## 📈 성능 최적화

### Nginx 최적화
- Gzip 압축 활성화
- 정적 파일 캐싱
- 연결 풀링
- 버퍼 크기 조정

### Docker 최적화
- Multi-stage 빌드
- 이미지 크기 최소화
- 레이어 캐싱 활용

### ECS 최적화
- Fargate 스팟 인스턴스 사용
- 오토 스케일링 설정
- 태스크 배치 전략

## 🔄 CI/CD 파이프라인

### GitHub Actions 예시
```yaml
name: Deploy to AWS ECS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2
      
      - name: Build and push
        run: ./scripts/build-and-push.sh
      
      - name: Deploy
        run: ./scripts/deploy.sh
```

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. AWS CloudWatch 로그
2. ECS 서비스 이벤트
3. ALB 헬스 체크 상태
4. 보안 그룹 규칙

추가 도움이 필요하면 개발팀에 문의하세요.

