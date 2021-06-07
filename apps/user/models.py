from crum import get_current_request
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.forms import model_to_dict

from apps.empresa.models import Empresa
from galpones.settings import MEDIA_URL

SEXO = (
    (1, 'Masculino'),
    (0, 'Femenino'),
)

ESTADO = (
    (1, 'ACTIVO'),
    (0, 'INACTIVO'),
)

tipo = (
    (1, 'ADMINISTRADOR'),
    (0, 'CLIENTE'),
)


class User(AbstractUser):
    avatar = models.ImageField(upload_to='user/%Y/%m/%d', blank=True, null=True)
    cedula = models.CharField(max_length=10, unique=True)
    celular = models.CharField(max_length=10, unique=True, blank=True, null=True)
    telefono = models.CharField(max_length=9, unique=True, blank=True, null=True)
    direccion = models.CharField(max_length=500, blank=True, null=True)
    sexo = models.IntegerField(choices=SEXO, default=1)
    estado = models.IntegerField(choices=ESTADO, default=1)
    tipo = models.IntegerField(choices=tipo, default=1)
    token = models.UUIDField(primary_key=False, editable=False, null=True, blank=True)

    def __str__(self):
        return '%s %s' % (self.username, self.first_name)

    def get_image(self):
        if self.avatar:
            return '{}{}'.format(MEDIA_URL, self.avatar)
        if self.sexo == 1:
            return '{}{}'.format(MEDIA_URL, 'user/user_men.png')
        else:
            return '{}{}'.format(MEDIA_URL, 'user/user_women.png')

    def toJSON(self):
        item = model_to_dict(self)
        if self.last_login:
            item['last_login'] = self.last_login.strftime('%d-%m-%Y')
        item['date_joined'] = self.date_joined.strftime('%d-%m-%Y')
        item['avatar'] = self.get_image()
        item['full_name'] = self.get_full_name()
        item['sexo'] = self.get_sexo_display()
        item['estado'] = self.get_estado_display()
        if self.groups:
            item['groups'] = [{'id': g.id, 'name': g.name} for g in self.groups.all()]
        return item

    def get_group_session(self):
        try:
            request = get_current_request()
            groups = self.groups.all()
            if groups.exists():
                if 'group' not in request.session:
                    request.session['group'] = groups[0]
        except Exception as e:
            pass

    class Meta:
        db_table = 'usuario'
        verbose_name = 'usuario'
        verbose_name_plural = 'usuarios'
        ordering = ['-first_name', '-last_name', '-cedula']

