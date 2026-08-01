# System Architecture


## Overview

BestT follows a client-server architecture.


Frontend:

React application


Backend:

Express API


Database:

PostgreSQL


AI Layer:

OpenAI + RAG pipeline


## High Level Flow


User

↓

React

↓

Express API

↓

Business Services

↓

Database / AI Services

↓

Response


## AI Flow


Student Question

↓

Retrieve relevant document chunks

↓

Build context

↓

Send to AI model

↓

Return grounded response