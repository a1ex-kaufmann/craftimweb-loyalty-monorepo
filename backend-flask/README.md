# SC API pos
API pos based on smart contracts. Partial copy of [API pos Rusbonus](https://s3.eu-central-1.amazonaws.com/Rusbonus-public-content/POS_API_Specification_Dinect.pdf).

Missing sections:
* logon
* loyalties
* products
* users/user/purchases/items

Current version contains implementation of only necessary methods for Evotor bonus system.

# Requirements
1. API was developed using [OpenAPI 3.0](https://swagger.io/specification/) specification

# Installation
1. Create virtual environment `python3.8 -m venv venv`
2. Activate virtual environment `source venv/bin/activate`
3. Install all dependencies `pip install -r api/requirements.txt`
4. Copy and edit config file `cp api/example.config.py api/config.py`
5. \[Optional\] Populate DB `python api/populate.py`

# Launch service
`python api/run.py`
`redis-server`
`cd api`
`rq worker`
Main site: [http://localhost:5000/20130701/ui/](http://localhost:5000/20130701/ui/)