# Database Design


## Users

Stores user accounts.


Fields:

id

name

email

password


---

## Courses

Stores student courses.


Fields:

id

title

description

userId


---

## Documents

Stores uploaded learning materials.


Fields:

id

filename

courseId


---

## DocumentChunks

Stores text sections for AI retrieval.


Fields:

id

content

embedding

documentId


---

## Quizzes

Stores generated quizzes.


Fields:

id

title

courseId


---

## Progress

Stores student performance.


Fields:

id

score

userId