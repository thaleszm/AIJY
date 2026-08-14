import { ProjectTemplate } from "../types";

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "spring-boot-ecommerce",
    name: "loja-virtual-api",
    badge: "Spring Boot + Java 17",
    description: "API RESTful corporativa para gestão de produtos, estoque e clientes com Spring Boot 3.2 e MySQL.",
    icon: "Coffee",
    technologies: ["Java 17", "Spring Boot 3.2", "Maven", "Spring Data JPA", "MySQL 8.0", "Lombok"],
    quickPrompts: [
      "Analise meu projeto e encontre possíveis problemas.",
      "Explique o erro que está acontecendo nas propriedades do Spring Boot.",
      "Crie os testes unitários com JUnit 5 e Mockito para o ProductController.",
      "Refatore o ProductController para usar DTOs e Service Pattern.",
      "Gere o Dockerfile e docker-compose.yml para subir a API com MySQL.",
      "Execute os testes unitários do projeto."
    ],
    files: [
      {
        path: "pom.xml",
        name: "pom.xml",
        language: "xml",
        content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.3</version>
        <relativePath/>
    </parent>
    <groupId>com.exemplo.loja</groupId>
    <artifactId>loja-api</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>loja-api</name>
    <description>API de E-commerce com Spring Boot</description>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>`
      },
      {
        path: "src/main/resources/application.properties",
        name: "application.properties",
        language: "properties",
        hasWarning: true,
        warningMessage: "Configuração de banco de dados incompleta e sem pool de conexões otimizado",
        content: `# Configurações do Spring Boot
spring.application.name=loja-api
server.port=8080

# Banco de Dados MySQL (Atenção: sem parâmetros de timezone e SSL)
spring.datasource.url=jdbc:mysql://localhost:3306/loja_db
spring.datasource.username=root
spring.datasource.password=root

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=false`
      },
      {
        path: "src/main/java/com/exemplo/loja/controller/ProductController.java",
        name: "ProductController.java",
        language: "java",
        content: `package com.exemplo.loja.controller;

import com.exemplo.loja.model.Product;
import com.exemplo.loja.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        // Possível melhoria: validar campos nulos e usar DTO
        Product saved = productRepository.save(product);
        return ResponseEntity.status(201).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}`
      },
      {
        path: "src/main/java/com/exemplo/loja/model/Product.java",
        name: "Product.java",
        language: "java",
        content: `package com.exemplo.loja.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "tb_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stockQuantity;
}`
      },
      {
        path: "README.md",
        name: "README.md",
        language: "markdown",
        content: `# Loja Virtual API

Microsserviço de catálogo e gerenciamento de produtos desenvolvido em Spring Boot 3.2.

## Pré-requisitos
- JDK 17+
- MySQL 8.0+
- Maven 3.9+

## Como Executar
\`\`\`bash
mvn spring-boot:run
\`\`\`
`
      }
    ]
  },
  {
    id: "fastapi-microservice",
    name: "payments-engine",
    badge: "Python 3.11 + FastAPI",
    description: "Serviço assíncrono de pagamentos e reconciliação financeira em Python com SQLAlchemy e Pydantic.",
    icon: "Flame",
    technologies: ["Python 3.11", "FastAPI", "SQLAlchemy", "Pydantic v2", "PostgreSQL", "Pytest", "Docker"],
    quickPrompts: [
      "Analise a arquitetura assíncrona do FastAPI.",
      "Verifique as queries SQLAlchemy para evitar N+1.",
      "Gere testes unitários e de integração com pytest e httpx.",
      "Crie um Dockerfile multi-stage com poetry/pip.",
      "Simule o deploy com docker-compose."
    ],
    files: [
      {
        path: "main.py",
        name: "main.py",
        language: "python",
        content: `from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uvicorn

from database import get_db
from models import PaymentOrder, PaymentCreate, PaymentOut

app = FastAPI(
    title="Payments Engine API",
    version="1.0.0",
    description="Processador de pagamentos com alta concorrência"
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "payments-engine"}

@app.post("/payments", response_model=PaymentOut, status_code=status.HTTP_201_CREATED)
async def process_payment(payload: PaymentCreate, db: AsyncSession = Depends(get_db)):
    # Validação e processamento seguro
    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="O valor deve ser maior que zero")
    
    order = PaymentOrder(
        customer_id=payload.customer_id,
        amount=payload.amount,
        currency=payload.currency,
        status="PENDING"
    )
    db.add(order)
    await db.commit()
    await db.refresh(order)
    return order
`
      },
      {
        path: "requirements.txt",
        name: "requirements.txt",
        language: "text",
        content: `fastapi==0.110.0
uvicorn[standard]==0.28.0
sqlalchemy==2.0.28
asyncpg==0.29.0
pydantic==2.6.4
pytest==8.1.1
pytest-asyncio==0.23.5
httpx==0.27.0
`
      },
      {
        path: "Dockerfile",
        name: "Dockerfile",
        language: "dockerfile",
        content: `FROM python:3.11-slim AS builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
`
      }
    ]
  },
  {
    id: "devops-k8s-cluster",
    name: "cloud-infra-k8s",
    badge: "DevOps + Kubernetes + CI/CD",
    description: "Infraestrutura como Código (IaC), manifests Kubernetes, GitHub Actions CI/CD e configuração de Ingress Nginx.",
    icon: "Server",
    technologies: ["Kubernetes", "Docker", "GitHub Actions", "Nginx Ingress", "Helm", "Prometheus"],
    quickPrompts: [
      "Audite os manifests Kubernetes para boas práticas de segurança e resource limits.",
      "Configure o pipeline de CI/CD no GitHub Actions com build, test e deploy.",
      "Adicione HPA (Horizontal Pod Autoscaler) baseado em CPU e memória.",
      "Gere regras de NetworkPolicy para isolamento de pods.",
      "Simule o comando: kubectl get pods -n production"
    ],
    files: [
      {
        path: "k8s/deployment.yaml",
        name: "deployment.yaml",
        language: "yaml",
        hasWarning: true,
        warningMessage: "Resource requests e limits não configurados nos containers",
        content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway-deployment
  namespace: production
  labels:
    app: api-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: gateway
        image: registry.empresa.com/api-gateway:v1.4.2
        ports:
        - containerPort: 8080
        # ALERTA: Faltando livenessProbe, readinessProbe e resources limits
`
      },
      {
        path: ".github/workflows/ci-cd.yml",
        name: "ci-cd.yml",
        language: "yaml",
        content: `name: Production CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      - name: Run Unit & Integration Tests
        run: mvn clean test
      - name: Security Scan
        run: echo "Executando auditoria de vulnerabilidades..."
`
      }
    ]
  },
  {
    id: "general-tutor",
    name: "chat-geral-livre",
    badge: "Tutor Universal de TI & Computação",
    description: "Espaço aberto para dúvidas de qualquer assunto: Algoritmos, Lógica, Cálculo, Estruturas de Dados, React, Rust, Go, Carreira em TI e Arquitetura.",
    icon: "Sparkles",
    technologies: ["Universal", "Lógica de Programação", "Algoritmos", "Ciência da Computação", "Matemática", "Arquitetura"],
    quickPrompts: [
      "Explique a diferença entre concorrência e paralelismo com exemplos práticos.",
      "Como funciona a complexidade Big-O e como calcular em laços aninhados?",
      "Explique o teorema CAP e consistência eventual em bancos distribuídos.",
      "O que são ponteiros em C e como gerenciar memória sem leaks?",
      "Explique derivadas e integrais no contexto de Machine Learning e Gradiente Descendente."
    ],
    files: [
      {
        path: "anotacoes.md",
        name: "anotacoes.md",
        language: "markdown",
        content: `# Caderno de Estudos e Anotações Técnicas
Faça qualquer pergunta sobre tecnologia, programação, arquitetura de sistemas ou matemática.
O AIJY se adapta ao seu nível e estilo de aprendizado!`
      }
    ]
  },
  {
    id: "calculo-1a",
    name: "calculo-e-algoritmos",
    badge: "Matemática & Computação Científica",
    description: "Cálculo diferencial, integral, álgebra linear e implementação computacional de algoritmos numéricos.",
    icon: "GraduationCap",
    technologies: ["Python", "NumPy", "Cálculo I", "Álgebra Linear", "Otimização Numérica"],
    quickPrompts: [
      "Explique o conceito de limite e continuidade de funções de forma intuitiva.",
      "Como implementar o método de Newton-Raphson para encontrar raízes de funções em Python?",
      "Qual é a intuição geométrica da derivada e da taxa de variação instantânea?",
      "Explique a regra da cadeia e onde ela é usada no backpropagation de redes neurais."
    ],
    files: [
      {
        path: "calculo_diferencial.py",
        name: "calculo_diferencial.py",
        language: "python",
        content: `import numpy as np

def derivada_numerica(f, x, h=1e-5):
    """Calcula a derivada de f(x) pela definição de limite de diferença finita."""
    return (f(x + h) - f(x - h)) / (2 * h)

# Exemplo: f(x) = x^2 + 3x + 2 -> f'(x) = 2x + 3
f = lambda x: x**2 + 3*x + 2
x0 = 4.0
print(f"Derivada em x={x0}:", derivada_numerica(f, x0)) # Esperado ~ 11.0
`
      }
    ]
  }
];
