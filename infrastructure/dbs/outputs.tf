output "postgres_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

# output "mongo_endpoint" {
#   value = aws_docdb_cluster.mongo.endpoint
# }

output "redis_endpoint" {
  value = aws_elasticache_cluster.redis.cache_nodes.0.address
}
