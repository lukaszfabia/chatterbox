provider "aws" {
  region = var.aws_region
}

resource "aws_db_subnet_group" "default" {
  name       = "db-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "RDS subnet group"
  }
}

resource "aws_db_instance" "postgres" {
  identifier             = "postgres-db"
  engine                 = "postgres"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  db_name                = var.db_name_postgres
  username               = var.db_user
  password               = var.db_password
  publicly_accessible    = true
  skip_final_snapshot    = true
  db_subnet_group_name   = aws_db_subnet_group.default.name
  vpc_security_group_ids = [var.security_group_id]
  port                   = 5432
}

# resource "aws_docdb_cluster" "mongo" {
#   cluster_identifier     = "mongo-cluster"
#   engine                 = "docdb"
#   master_username        = var.db_user
#   master_password        = var.db_password
#   skip_final_snapshot    = true
#   db_subnet_group_name   = aws_db_subnet_group.default.name
#   vpc_security_group_ids = [var.security_group_id]
#   port                   = 27017

#   tags = {
#     Name = "MongoDB Cluster"
#   }
# }

# resource "aws_docdb_cluster_instance" "mongo_instance_1" {
#   cluster_identifier = aws_docdb_cluster.mongo.id
#   instance_class     = "db.r5.large"
#   engine             = "docdb"
# }

# resource "aws_docdb_cluster_instance" "mongo_instance_2" {
#   cluster_identifier = aws_docdb_cluster.mongo.id
#   instance_class     = "db.r5.large"
#   engine             = "docdb"
# }

# resource "aws_docdb_cluster_instance" "mongo_instance_3" {
#   cluster_identifier = aws_docdb_cluster.mongo.id
#   instance_class     = "db.r5.large"
#   engine             = "docdb"
# }

resource "aws_security_group" "redis" {
  name        = "redis-sg"
  description = "Allow access to Redis"

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


resource "aws_elasticache_subnet_group" "redis" {
  name       = "redis-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "Redis Subnet Group"
  }
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id         = "redis-cluster"
  engine             = "redis"
  node_type          = "cache.t3.micro"
  num_cache_nodes    = 1
  subnet_group_name  = aws_elasticache_subnet_group.redis.name
  security_group_ids = [var.security_group_id]
  port               = 6379

  tags = {
    Name = "Redis Cluster"
  }
}


resource "aws_security_group" "db_sg" {
  name_prefix = "db_sg"
  vpc_id      = var.vpc_id
}


