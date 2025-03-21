# Generated by Django 5.1.6 on 2025-03-21 06:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_alter_analysed_news_sentiment_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='system_config',
            fields=[
                ('sysdb_id', models.IntegerField(primary_key=True, serialize=False)),
                ('sysdb_name', models.CharField(blank=True, max_length=50, null=True)),
                ('sysdb_data', models.JSONField(default=dict)),
                ('all_news_category', models.JSONField(default=list)),
            ],
        ),
    ]
