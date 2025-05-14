provider "aws" {
  region = "us-east-1"
}

resource "aws_key_pair" "deployer" {
  key_name   = "ec2-key"
  public_key = file("~/.ssh/id_rsa.pub")
}

resource "aws_security_group" "allow_web" {
  name        = "allow_web_2"
  description = "Allow HTTP and app ports"

  ingress {
    from_port   = 8001
    to_port     = 8005
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "docker_host" {
  ami                         = "ami-084568db4383264d4"
  instance_type               = "t2.large"
  key_name                    = aws_key_pair.deployer.key_name
  security_groups             = [aws_security_group.allow_web.name]
  associate_public_ip_address = true
  user_data                   = file("docker.sh")

  tags = {
    Name = "docker-compose-instance"
  }
}
