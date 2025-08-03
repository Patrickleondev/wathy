// Template de questions/réponses pour chatbot audit Oracle
// Chaque entrée contient : question, categorie, champs utilisés, réponse type

const questionTemplates = [

    {
      question: "Quels sont les utilisateurs OS (OS_USERNAME) qui se connectent à la base de données ?",
      categorie: "Utilisateurs",
      champs: ["OS_USERNAME"],
      reponse: "Les utilisateurs OS sont : datchemi, tahose, olan, root, oracle, BACKUP, Administrateur."
    },
    {
      question: "Quels utilisateurs utilisateurs ont effectué le plus d'actions ?",
      categorie: "Utilisateurs",
      champs: ["DBUSERNAME","ACTION_NAME"],
      reponse: "Les utilisateurs les plus actifs sont : ATCHEMI (SELECT sur SYS), OLA (Toad), root (TRUNCATE via JDBC)."
    },
    {
      question: "Quels sont les hôtes  d'où proviennent les connexions ?",
      categorie: "Infrastructure",
      champs: ["USERHOST"],
      reponse: "Les hôtes sont : WLXREBOND, LAPOSTE\PC-ATCHEMI, apiprod, jdbcclient, frmprod01."
    },
    {
      question: "Combien de sessions uniques (SESSIONID) sont enregistrées ?",
      categorie: "Sessions",
      champs: ["SESSIONID"],
      reponse: "Exemples de sessions uniques : 994729870, 2315658237, 604592084 (certaines durent des heures)."
    },
    {
      question: "Quels utilisateurs ont effectué des opérations de TRUNCATE TABLE ?",
      categorie: "Actions",
      champs: ["DBUSERNAME","ACTION_NAME"],
      reponse: "Les utilisateurs avec TRUNCATE sont : root (via JDBC), BATCH_USER (via sqlplus)."
    },
    {
      question: "Combien d'opérations SELECT sont enregistrées ?",
      categorie: "Statistiques",
      champs: ["ACTION_NAME"],
      reponse: "Il y a 200+ opérations SELECT, surtout sur SYS.OBJ$, SYS.USER$."
    },
    {
      question: "Combien d'opérations LOGON sont enregistrées ?",
      categorie: "Statistiques",
      champs: ["ACTION_NAME"],
      reponse: "Il y a environ 30 connexions LOGON distinctes."
    },
    {
      question: "Quelles tables ont été le plus souvent interrogées via SELECT ?",
      categorie: "Objets",
      champs: ["OBJECT_NAME","ACTION_NAME"],
      reponse: "Les tables les plus consultées sont : SYS.OBJ$, SYS.USER$, SYS.TAB$, DUAL."
    },
    {
      question: "Combien d'opérations SET ROLE sont enregistrées ?",
      categorie: "Statistiques",
      champs: ["ACTION_NAME"],
      reponse: "Il y a 50+ opérations SET ROLE par rwbuilder.exe (session 2315658237)."
    },
    {
      question: "Quelles sont les tables qui ont été tronquées (TRUNCATE) ?",
      categorie: "Actions",
      champs: ["OBJECT_NAME","ACTION_NAME"],
      reponse: "Les tables tronquées sont : IMOBILE.MOUVEMENT_UL (7x), MBUDGET.TEMP2 (5x), EPOSTE.MOUVEMENT_EPOSTE (2x)."
    },
    {
      question: "Quels schémas (OBJECT_SCHEMA) sont les plus actifs ?",
      categorie: "Objets",
      champs: ["OBJECT_SCHEMA"],
      reponse: "Les schémas les plus actifs sont : SYS (accès système), SPT, IMOBILE, MBUDGET, EPOSTE."
    },
    {
      question: "Quelles tables (OBJECT_NAME) sont les plus fréquemment accédées ?",
      categorie: "Objets",
      champs: ["OBJECT_NAME"],
      reponse: "Les tables les plus accédées sont : OBJ$, USER$ (système), COMPTE, MOUVEMENT_UL (métier)."
    },
    {
      question: "Y a-t-il des accès à des tables système comme SYS.OBJ$ ?",
      categorie: "Sécurité",
      champs: ["OBJECT_SCHEMA","OBJECT_NAME"],
      reponse: "Oui, il y a des accès à SYS.OBJ$ par ATCHEMI via SQL Developer (reconnaissance de la base)."
    },
    {
      question: "Combien d'opérations concernent des objets dans le schéma SYS ?",
      categorie: "Statistiques",
      champs: ["OBJECT_SCHEMA"],
      reponse: "Il y a 150+ SELECT sur des objets du schéma SYS."
    },
    {
      question: "Quels objets ont été modifiés via UPDATE ?",
      categorie: "Actions",
      champs: ["OBJECT_NAME","ACTION_NAME"],
      reponse: "Les objets modifiés par UPDATE sont : SPT.COMPTE (par OLA via Toad)."
    },
    {
      question: "Quels sont les trois programmes clients les plus utilisés ?",
      categorie: "Clients",
      champs: ["CLIENT_PROGRAM_NAME"],
      reponse: "Les trois programmes les plus utilisés sont : 1) SQL Developer (ATCHEMI), 2) Toad.exe (OLA/AHOSE), 3) JDBC Thin Client (root)."
    },
    {
      question: "Combien de connexions proviennent de SQL Developer ?",
      categorie: "Statistiques",
      champs: ["CLIENT_PROGRAM_NAME"],
      reponse: "Il y a environ 100 actions via SQL Developer (majorité des SELECT système)."
    },
    {
      question: "Combien de connexions proviennent de Toad.exe ?",
      categorie: "Statistiques",
      champs: ["CLIENT_PROGRAM_NAME"],
      reponse: "Il y a environ 50 actions via Toad.exe (LOGON, UPDATE, ALTER SYSTEM)."
    },
    {
      question: "Combien de connexions utilisent JDBC Thin Client ?",
      categorie: "Statistiques",
      champs: ["CLIENT_PROGRAM_NAME"],
      reponse: "Il y a environ 20 TRUNCATE via JDBC Thin Client sur des tables métier."
    },
    {
      question: "Quelles actions sont effectuées par rwbuilder.exe ?",
      categorie: "Actions",
      champs: ["CLIENT_PROGRAM_NAME","ACTION_NAME"],
      reponse: "rwbuilder.exe effectue uniquement des SET ROLE (session 2315658237)."
    },
    {
      question: "À quelle heure de la journée y a-t-il le plus d'activité ?",
      categorie: "Temps",
      champs: ["EVENT_TIMESTAMP"],
      reponse: "Les pics d'activité sont : 11h30–12h30 (TRUNCATE) et 15h–16h (connexions)."
    },
    {
      question: "Quel est le premier événement enregistré dans le fichier ?",
      categorie: "Temps",
      champs: ["EVENT_TIMESTAMP"],
      reponse: "Le premier événement est : 11/07/2025 08:48:43 (OLA via Toad, ALTER SYSTEM)."
    },
    {
      question: "Quel est le dernier événement enregistré dans le fichier ?",
      categorie: "Temps",
      champs: ["EVENT_TIMESTAMP"],
      reponse: "Le dernier événement est : 11/07/2025 18:26:26 (AWATA via frmprod01)."
    },
    {
      question: "Y a-t-il des opérations effectuées en dehors des heures de bureau ?",
      categorie: "Temps",
      champs: ["EVENT_TIMESTAMP"],
      reponse: "Non, il n'y a pas d'activité nocturne (uniquement 8h–18h)."
    },
    {
      question: "Combien de temps dure la session la plus longue ?",
      categorie: "Sessions",
      champs: ["SESSIONID","EVENT_TIMESTAMP"],
      reponse: "La session 604592084 (OLA) dure de 8h à 18h (10 heures)."
    },
    {
      question: "Quelles adresses IP (HOST dans CLIENT_ADDRESS) sont les plus actives ?",
      categorie: "Infrastructure",
      champs: ["AUTHENTICATION_TYPE"],
      reponse: "Les IPs les plus actives sont : 192.168.60.42 (Toad), 192.168.60.23 (JDBC), 192.168.200.93 (rwbuilder)."
    },
    {
      question: "Combien de connexions proviennent de 192.168.60.42 ?",
      categorie: "Statistiques",
      champs: ["AUTHENTICATION_TYPE"],
      reponse: "Il y a environ 100 connexions depuis 192.168.60.42 (Toad + SQL Developer)."
    },
    {
      question: "Quels ports sont utilisés pour les connexions ?",
      categorie: "Infrastructure",
      champs: ["AUTHENTICATION_TYPE"],
      reponse: "Exemples de ports utilisés : 50259 (Toad), 51105 (SQL Developer), 59515 (JDBC)."
    },
    {
      question: "Y a-t-il des connexions depuis des réseaux non autorisés ?",
      categorie: "Sécurité",
      champs: ["AUTHENTICATION_TYPE"],
      reponse: "Non, toutes les connexions proviennent de réseaux internes (192.168.x.x)."
    },
    {
      question: "Combien de connexions proviennent de terminaux 'unknown' ?",
      categorie: "Statistiques",
      champs: ["TERMINAL"],
      reponse: "SQL Developer utilise des terminaux 'unknown' (TERMINAL=unknown)."
    },
    {
      question: "Quels utilisateurs ont effectué des opérations DDL (CREATE, ALTER) ?",
      categorie: "Actions",
      champs: ["DBUSERNAME","ACTION_NAME"],
      reponse: "Les utilisateurs DDL sont : OLA (ALTER SYSTEM), BATCH_USER (CREATE INDEX)."
    },
    {
      question: "Qui a créé ou modifié des procédures stockées ?",
      categorie: "Actions",
      champs: ["DBUSERNAME","OBJECT_NAME"],
      reponse: "AHOSE a créé SUBSOLAIRE.MOON_API_DATA_VALIDATION."
    },
    {
      question: "Quels utilisateurs ont utilisé SET ROLE ?",
      categorie: "Actions",
      champs: ["DBUSERNAME","ACTION_NAME"],
      reponse: "SET ROLE est utilisé exclusivement par rwbuilder.exe (ATCHEMI)."
    },
    {
      question: "Y a-t-il des opérations ALTER SYSTEM dans les logs ?",
      categorie: "Actions",
      champs: ["ACTION_NAME"],
      reponse: "Oui, il y a 100+ ALTER SYSTEM par OLA via Toad (session 604592084)."
    },
    {
      question: "Qui a créé des index ?",
      categorie: "Actions",
      champs: ["DBUSERNAME","OBJECT_NAME","ACTION_NAME"],
      reponse: "BATCH_USER a créé l'index SPT.MVO_SOLDE_CPTE_JOUR_ANCIEN_PK."
    },
    {
      question: "Combien d'opérations concernent le schéma SPT ?",
      categorie: "Statistiques",
      champs: ["OBJECT_SCHEMA"],
      reponse: "Les opérations sur SPT incluent : UPDATE COMPTE, TRUNCATE SOLDE_CPT_JR_ANCIEN."
    },
    {
      question: "Quelles tables du schéma SPT sont accédées ?",
      categorie: "Objets",
      champs: ["OBJECT_SCHEMA","OBJECT_NAME"],
      reponse: "Les tables SPT accédées sont : COMPTE, T_INACTIF_CCP, SOLDE_CPT_JR_ANCIEN."
    },
    {
      question: "Combien d'opérations concernent le schéma EPOSTE ?",
      categorie: "Statistiques",
      champs: ["OBJECT_SCHEMA"],
      reponse: "Il y a 2 TRUNCATE MOUVEMENT_EPOSTE par l'utilisateur EPOSTE."
    },
    {
      question: "Quelles actions sont effectuées sur IMOBILE.MOUVEMENT_UL ?",
      categorie: "Actions",
      champs: ["OBJECT_SCHEMA","OBJECT_NAME","ACTION_NAME"],
      reponse: "Sur IMOBILE.MOUVEMENT_UL : 7 TRUNCATE par root (JDBC)."
    },
    {
      question: "Y a-t-il des opérations sur MBUDGET.TEMP2 ?",
      categorie: "Actions",
      champs: ["OBJECT_SCHEMA","OBJECT_NAME"],
      reponse: "Oui, il y a 5 TRUNCATE sur MBUDGET.TEMP2 par GST_DEKOU."
    },
    {
      question: "Tous les enregistrements sont-ils de type 'Standard' ?",
      categorie: "Audit",
      champs: ["AUDIT_TYPE"],
      reponse: "Oui, tous les enregistrements sont de type 'Standard'."
    },
    {
      question: "Y a-t-il des différences entre les instances (INSTANCE) ?",
      categorie: "Infrastructure",
      champs: ["INSTANCE"],
      reponse: "Tous les événements proviennent de la même instance."
    },
    {
      question: "Tous les événements proviennent-ils de 'PRODUCTION' ?",
      categorie: "Infrastructure",
      champs: ["ENVIRONMENT"],
      reponse: "Oui, tous les événements proviennent de l'environnement 'PRODUCTION'."
    },
    {
      question: "Combien d'événements sont des connexions réussies ?",
      categorie: "Statistiques",
      champs: ["ACTION_NAME"],
      reponse: "Toutes les connexions LOGON sont réussies (pas d'échecs d'authentification)."
    },
    {
      question: "Y a-t-il des échecs d'authentification ?",
      categorie: "Sécurité",
      champs: ["ACTION_NAME"],
      reponse: "Non, il n'y a pas d'échecs d'authentification enregistrés."
    },
    {
      question: "Quelle est la fréquence des opérations TRUNCATE TABLE ?",
      categorie: "Statistiques",
      champs: ["ACTION_NAME"],
      reponse: "La fréquence des TRUNCATE est élevée : 7x sur MOUVEMENT_UL, 5x sur TEMP2, 2x sur MOUVEMENT_EPOSTE."
    },
    {
      question: "Quel utilisateur a effectué le plus de TRUNCATE TABLE ?",
      categorie: "Actions",
      champs: ["DBUSERNAME","ACTION_NAME"],
      reponse: "L'utilisateur root a effectué le plus de TRUNCATE (via JDBC Thin Client)."
    },
    {
      question: "Combien de fois la table MOUVEMENT_UL a-t-elle été tronquée ?",
      categorie: "Statistiques",
      champs: ["OBJECT_NAME","ACTION_NAME"],
      reponse: "La table MOUVEMENT_UL a été tronquée 7 fois par root (JDBC)."
    },
    {
      question: "Y a-t-il des patterns dans les heures des opérations TRUNCATE ?",
      categorie: "Temps",
      champs: ["EVENT_TIMESTAMP","ACTION_NAME"],
      reponse: "Oui, les TRUNCATE sont groupés : MOUVEMENT_UL tronquée 3x en 10 minutes."
    },
    {
      question: "Combien de temps s'écoule entre deux TRUNCATE sur la même table ?",
      categorie: "Temps",
      champs: ["EVENT_TIMESTAMP","OBJECT_NAME","ACTION_NAME"],
      reponse: "Le temps entre TRUNCATE varie : parfois quelques minutes, parfois plusieurs heures."
    },
    {
      question: "Quelle session (SESSIONID) a duré le plus longtemps ?",
      categorie: "Sessions",
      champs: ["SESSIONID","EVENT_TIMESTAMP"],
      reponse: "La session 604592084 (OLA) a duré le plus longtemps : 8h à 18h."
    },
    {
      question: "Combien d'actions sont effectuées par session en moyenne ?",
      categorie: "Statistiques",
      champs: ["SESSIONID","ACTION_NAME"],
      reponse: "Le nombre d'actions par session varie : certaines sessions ont des centaines d'actions."
    },
    {
      question: "Y a-t-il des sessions avec un nombre anormal d'actions ?",
      categorie: "Sécurité",
      champs: ["SESSIONID","ACTION_NAME"],
      reponse: "Oui, la session 604592084 (OLA) a un nombre élevé d'ALTER SYSTEM."
    },
    {
      question: "Quelles sessions ont effectué à la fois SELECT et UPDATE ?",
      categorie: "Actions",
      champs: ["SESSIONID","ACTION_NAME"],
      reponse: "Plusieurs sessions ont effectué SELECT et UPDATE, notamment celles utilisant Toad."
    },
    {
      question: "Combien de sessions proviennent du même hôte ?",
      categorie: "Infrastructure",
      champs: ["USERHOST","SESSIONID"],
      reponse: "Plusieurs sessions proviennent du même hôte, notamment WLXREBOND et LAPOSTE\PC-ATCHEMI."
    },
    {
      question: "Quelles tables ont été mises à jour (UPDATE) ?",
      categorie: "Actions",
      champs: ["OBJECT_NAME","ACTION_NAME"],
      reponse: "La table SPT.COMPTE a été mise à jour par OLA via Toad."
    },
    {
      question: "Qui a effectué des INSERT dans SPT.MOUVEMENT ?",
      categorie: "Actions",
      champs: ["DBUSERNAME","OBJECT_NAME","ACTION_NAME"],
      reponse: "Aucun INSERT n'est enregistré dans SPT.MOUVEMENT dans ces logs."
    },
    {
      question: "Y a-t-il des DELETE enregistrés ?",
      categorie: "Actions",
      champs: ["ACTION_NAME"],
      reponse: "Non, il n'y a pas d'opérations DELETE enregistrées dans ces logs."
    },
    {
      question: "Quelles tables ont eu des INSERT et DELETE le même jour ?",
      categorie: "Actions",
      champs: ["OBJECT_NAME","ACTION_NAME","EVENT_TIMESTAMP"],
      reponse: "Aucune table n'a eu d'INSERT et DELETE le même jour (pas de DELETE enregistrés)."
    },
    {
      question: "Combien d'opérations DML sont enregistrées ?",
      categorie: "Statistiques",
      champs: ["ACTION_NAME"],
      reponse: "Les opérations DML enregistrées sont : UPDATE (SPT.COMPTE) et TRUNCATE (plusieurs tables)."
    },
    {
      question: "Combien d'accès à SYS.USER$ sont enregistrés ?",
      categorie: "Statistiques",
      champs: ["OBJECT_SCHEMA","OBJECT_NAME"],
      reponse: "Il y a de nombreux accès à SYS.USER$ par ATCHEMI via SQL Developer."
    },
    {
      question: "Pourquoi y a-t-il tant d'accès à SYS.OBJ$ ?",
      categorie: "Sécurité",
      champs: ["OBJECT_SCHEMA","OBJECT_NAME","DBUSERNAME"],
      reponse: "Les accès à SYS.OBJ$ sont effectués par ATCHEMI via SQL Developer pour la reconnaissance de la base."
    },
    {
      question: "Quels objets système sont les plus consultés ?",
      categorie: "Objets",
      champs: ["OBJECT_SCHEMA","OBJECT_NAME"],
      reponse: "Les objets système les plus consultés sont : SYS.OBJ$, SYS.USER$, SYS.TAB$, DUAL."
    },
    {
      question: "Y a-t-il des accès à GV$ENABLEDPRIVS ?",
      categorie: "Objets",
      champs: ["OBJECT_NAME"],
      reponse: "Non, il n'y a pas d'accès à GV$ENABLEDPRIVS dans ces logs."
    },
    {
      question: "Combien d'accès à DUAL sont enregistrés ?",
      categorie: "Statistiques",
      champs: ["OBJECT_NAME"],
      reponse: "Il y a plusieurs accès à DUAL, table système Oracle utilisée pour les requêtes simples."
    },
    {
      question: "Quelles applications (CLIENT_PROGRAM_NAME) accèdent à quelles tables ?",
      categorie: "Applications",
      champs: ["CLIENT_PROGRAM_NAME","OBJECT_NAME"],
      reponse: "SQL Developer accède aux tables système, Toad aux tables métier, JDBC aux tables de données."
    },
    {
      question: "SQL Developer est-il utilisé pour des opérations administratives ?",
      categorie: "Applications",
      champs: ["CLIENT_PROGRAM_NAME","ACTION_NAME"],
      reponse: "Oui, SQL Developer est utilisé par ATCHEMI pour des opérations administratives (accès SYS)."
    },
    {
      question: "Toad.exe est-il utilisé pour des opérations spécifiques ?",
      categorie: "Applications",
      champs: ["CLIENT_PROGRAM_NAME","ACTION_NAME"],
      reponse: "Oui, Toad.exe est utilisé par OLA pour ALTER SYSTEM et UPDATE sur SPT.COMPTE."
    },
    {
      question: "JDBC Thin Client est-il utilisé pour des opérations batch ?",
      categorie: "Applications",
      champs: ["CLIENT_PROGRAM_NAME","ACTION_NAME"],
      reponse: "Oui, JDBC Thin Client est utilisé par root pour des TRUNCATE (opérations batch)."
    },
    {
      question: "rwbuilder.exe est-il utilisé pour des opérations particulières ?",
      categorie: "Applications",
      champs: ["CLIENT_PROGRAM_NAME","ACTION_NAME"],
      reponse: "Oui, rwbuilder.exe est utilisé exclusivement pour des SET ROLE (session 2315658237)."
    },
    {
      question: "Y a-t-il des accès suspects à des tables système ?",
      categorie: "Sécurité",
      champs: ["OBJECT_SCHEMA","DBUSERNAME"],
      reponse: "Oui, ATCHEMI accède de manière excessive aux tables système via SQL Developer."
    },
    {
      question: "Des utilisateurs normaux accèdent-ils à des objets SYS ?",
      categorie: "Sécurité",
      champs: ["OBJECT_SCHEMA","DBUSERNAME"],
      reponse: "Oui, ATCHEMI (utilisateur normal) accède aux objets SYS via SQL Developer."
    },
    {
      question: "Y a-t-il des opérations sensibles effectuées par des applications ?",
      categorie: "Sécurité",
      champs: ["CLIENT_PROGRAM_NAME","ACTION_NAME"],
      reponse: "Oui, JDBC effectue des TRUNCATE et Toad effectue des ALTER SYSTEM."
    },
    {
      question: "Les TRUNCATE sont-ils effectués par des utilisateurs appropriés ?",
      categorie: "Sécurité",
      champs: ["DBUSERNAME","ACTION_NAME"],
      reponse: "Les TRUNCATE sont effectués par root et BATCH_USER, ce qui semble approprié mais la fréquence est élevée."
    },
    {
      question: "Y a-t-il des connexions depuis des hôtes non autorisés ?",
      categorie: "Sécurité",
      champs: ["USERHOST","AUTHENTICATION_TYPE"],
      reponse: "Non, toutes les connexions proviennent de réseaux internes autorisés (192.168.x.x)."
    },
    {
      question: "Quel est le pic d'activité dans la journée ?",
      categorie: "Temps",
      champs: ["EVENT_TIMESTAMP"],
      reponse: "Les pics d'activité sont : 11h–12h et 15h–16h."
    },
    {
      question: "Y a-t-il des opérations la nuit ?",
      categorie: "Temps",
      champs: ["EVENT_TIMESTAMP"],
      reponse: "Non, il n'y a pas d'opérations nocturnes (uniquement 8h–18h)."
    },
    {
      question: "Combien de temps entre le premier et le dernier événement ?",
      categorie: "Temps",
      champs: ["EVENT_TIMESTAMP"],
      reponse: "Il y a 10 heures entre le premier (8h48) et le dernier événement (18h26)."
    },
    {
      question: "Les opérations TRUNCATE sont-elles groupées dans le temps ?",
      categorie: "Temps",
      champs: ["EVENT_TIMESTAMP","ACTION_NAME"],
      reponse: "Oui, les TRUNCATE sont groupés : MOUVEMENT_UL tronquée 3x en 10 minutes."
    },
    {
      question: "Y a-t-il des sessions qui durent plusieurs heures ?",
      categorie: "Sessions",
      champs: ["SESSIONID","EVENT_TIMESTAMP"],
      reponse: "Oui, la session 604592084 (OLA) dure de 8h à 18h (10 heures)."
    },
    {
      question: "Combien de fois SET ROLE est-il appelé ?",
      categorie: "Statistiques",
      champs: ["ACTION_NAME"],
      reponse: "SET ROLE est appelé 50+ fois par rwbuilder.exe."
    },
    {
      question: "Quels utilisateurs utilisent SET ROLE ?",
      categorie: "Actions",
      champs: ["DBUSERNAME","ACTION_NAME"],
      reponse: "SET ROLE est utilisé uniquement par ATCHEMI via rwbuilder.exe."
    },
    {
      question: "Y a-t-il des patterns dans l'utilisation de SET ROLE ?",
      categorie: "Actions",
      champs: ["EVENT_TIMESTAMP","ACTION_NAME"],
      reponse: "Oui, les SET ROLE sont groupés en rafales (ex: 10x en 1 minute)."
    },
    {
      question: "SET ROLE est-il utilisé avec des applications spécifiques ?",
      categorie: "Applications",
      champs: ["CLIENT_PROGRAM_NAME","ACTION_NAME"],
      reponse: "Oui, SET ROLE est utilisé exclusivement avec rwbuilder.exe."
    },
    {
      question: "Combien de SET ROLE par session en moyenne ?",
      categorie: "Statistiques",
      champs: ["SESSIONID","ACTION_NAME"],
      reponse: "Il y a environ 20 SET ROLE par session 2315658237."
    },
    {
      question: "Quels schémas contiennent des tables tronquées ?",
      categorie: "Objets",
      champs: ["OBJECT_SCHEMA","ACTION_NAME"],
      reponse: "Les schémas avec TRUNCATE sont : IMOBILE, MBUDGET, EPOSTE, SPT."
    },
    {
      question: "Le schéma SPT est-il utilisé pour quels types d'opérations ?",
      categorie: "Actions",
      champs: ["OBJECT_SCHEMA","ACTION_NAME"],
      reponse: "Le schéma SPT est utilisé pour : UPDATE COMPTE, TRUNCATE SOLDE_CPT_JR_ANCIEN."
    },
    {
      question: "Qui accède au schéma IMOBILE ?",
      categorie: "Actions",
      champs: ["OBJECT_SCHEMA","DBUSERNAME"],
      reponse: "Seul root accède au schéma IMOBILE (uniquement pour TRUNCATE MOUVEMENT_UL)."
    },
    {
      question: "Y a-t-il des opérations croisées entre schémas ?",
      categorie: "Actions",
      champs: ["OBJECT_SCHEMA","DBUSERNAME"],
      reponse: "Non, les schémas sont utilisés de manière isolée par des utilisateurs différents."
    },
    {
      question: "Quel schéma a le plus d'opérations UPDATE ?",
      categorie: "Statistiques",
      champs: ["OBJECT_SCHEMA","ACTION_NAME"],
      reponse: "Le schéma SPT a le plus d'opérations UPDATE (table COMPTE)."
    },
    {
      question: "Comment est structuré le champ AUTHENTICATION_TYPE ?",
      categorie: "Technique",
      champs: ["AUTHENTICATION_TYPE"],
      reponse: "Le format est : (TYPE=(DATABASE)) + adresse TCP avec port."
    },
    {
      question: "Que représente le champ TERMINAL ?",
      categorie: "Technique",
      champs: ["TERMINAL"],
      reponse: "TERMINAL représente : PC-ATCHEMI, WLXREBOND, ou 'unknown' pour SQL Developer."
    },
    {
      question: "Comment interpréter les timestamps avec microsecondes ?",
      categorie: "Technique",
      champs: ["EVENT_TIMESTAMP"],
      reponse: "Le format est : DD/MM/YYYY HH:MM:SS,ssssss (avec microsecondes)."
    },
    {
      question: "Quelle est la signification des IDs en première colonne ?",
      categorie: "Technique",
      champs: ["ID"],
      reponse: "Les IDs sont des identifiants uniques séquentiels (ex: 103103014481)."
    },
    {
      question: "Comment sont générés les SESSIONID ?",
      categorie: "Technique",
      champs: ["SESSIONID"],
      reponse: "Les SESSIONID sont apparemment générés de manière aléatoire (ex: 994729870)."
    },

  // === NOUVELLES QUESTIONS DÉTAILLÉES (100 questions) ===
  
  // Questions générales sur les données (1-5)
  {
    question: "Combien d'événements d'audit sont enregistrés dans ce fichier ?",
    categorie: "Statistiques",
    champs: ["ID"],
    reponse: "Il y a 500+ événements d'audit enregistrés (fichier tronqué, dernier ID visible : 103102200272)."
  },
  {
    question: "Quelle est la période couverte par ces données d'audit ?",
    categorie: "Temps",
    champs: ["EVENT_TIMESTAMP"],
    reponse: "La période couverte va du 11/07/2025 08:48:43 au 11/07/2025 18:26:26 (environ 10 heures)."
  },
  {
    question: "Quels sont les différents types d'actions (ACTION_NAME) enregistrées ?",
    categorie: "Actions",
    champs: ["ACTION_NAME"],
    reponse: "Les types d'actions enregistrées sont : SELECT (majoritaire), LOGON, SET ROLE, TRUNCATE TABLE, UPDATE, CREATE INDEX, ALTER PROCEDURE."
  },
  {
    question: "Combien d'utilisateurs différents (DBUSERNAME) apparaissent dans les logs ?",
    categorie: "Utilisateurs",
    champs: ["DBUSERNAME"],
    reponse: "Les utilisateurs différents sont : ATCHEMI, OLA, AHOSE, EPOSTE, IMOBILE, GST_DEKOU, MAMAH, BATCH_USER, SPT, MARDJA."
  },
  {
    question: "Quels sont les programmes clients (CLIENT_PROGRAM_NAME) les plus utilisés ?",
    categorie: "Clients",
    champs: ["CLIENT_PROGRAM_NAME"],
    reponse: "Les programmes clients les plus utilisés sont : SQL Developer, Toad.exe, JDBC Thin Client, rwbuilder.exe, frmweb.exe."
  },
  // === NOUVELLES QUESTIONS DÉTAILLÉES (100 questions) ===
  
  // Questions générales sur les données (1-5)
  {
    question: "Combien d'événements d'audit sont enregistrés dans ce fichier ?",
    categorie: "Statistiques",
    champs: ["ID"],
    reponse: "Il y a 500+ événements d'audit enregistrés (fichier tronqué, dernier ID visible : 103102200272)."
  },
  {
    question: "Quelle est la période couverte par ces données d'audit ?",
    categorie: "Temps",
    champs: ["EVENT_TIMESTAMP"],
    reponse: "La période couverte va du 11/07/2025 08:48:43 au 11/07/2025 18:26:26 (environ 10 heures)."
  },
  {
    question: "Quels sont les différents types d'actions (ACTION_NAME) enregistrées ?",
    categorie: "Actions",
    champs: ["ACTION_NAME"],
    reponse: "Les types d'actions enregistrées sont : SELECT (majoritaire), LOGON, SET ROLE, TRUNCATE TABLE, UPDATE, CREATE INDEX, ALTER PROCEDURE."
  },
  {
    question: "Combien d'utilisateurs différents (DBUSERNAME) apparaissent dans les logs ?",
    categorie: "Utilisateurs",
    champs: ["DBUSERNAME"],
    reponse: "Les utilisateurs différents sont : ATCHEMI, OLA, AHOSE, EPOSTE, IMOBILE, GST_DEKOU, MAMAH, BATCH_USER, SPT, MARDJA."
  },
  {
    question: "Quels sont les programmes clients (CLIENT_PROGRAM_NAME) les plus utilisés ?",
    categorie: "Clients",
    champs: ["CLIENT_PROGRAM_NAME"],
    reponse: "Les programmes clients les plus utilisés sont : SQL Developer, Toad.exe, JDBC Thin Client, rwbuilder.exe, frmweb.exe."
  },
  
  // Questions sur les utilisateurs (6-10)
  {
    question: "Quels sont les utilisateurs OS (OS_USERNAME) qui se connectent à la base de données ?",
    categorie: "Utilisateurs",
    champs: ["OS_USERNAME"],
    reponse: "Les utilisateurs OS sont : datchemi, tahose, olan, root, oracle, BACKUP, Administrateur."
  },
  {
    question: "Quels utilisateurs (DBUSERNAME) ont effectué le plus d'actions ?",
    categorie: "Utilisateurs",
    champs: ["DBUSERNAME", "ACTION_NAME"],
    reponse: "Les utilisateurs les plus actifs sont : ATCHEMI (SELECT sur SYS), OLA (Toad), root (TRUNCATE via JDBC)."
  },
  {
    question: "Quels sont les hôtes (USERHOST) d'où proviennent les connexions ?",
    categorie: "Infrastructure",
    champs: ["USERHOST"],
    reponse: "Les hôtes sont : WLXREBOND, LAPOSTE\\PC-ATCHEMI, apiprod, jdbcclient, frmprod01."
  },
  {
    question: "Combien de sessions uniques (SESSIONID) sont enregistrées ?",
    categorie: "Sessions",
    champs: ["SESSIONID"],
    reponse: "Exemples de sessions uniques : 994729870, 2315658237, 604592084 (certaines durent des heures)."
  },
  {
    question: "Quels utilisateurs ont effectué des opérations de TRUNCATE TABLE ?",
    categorie: "Actions",
    champs: ["DBUSERNAME", "ACTION_NAME"],
    reponse: "Les utilisateurs avec TRUNCATE sont : root (via JDBC), BATCH_USER (via sqlplus)."
  },
  
  // Questions sur les actions (11-15)
  {
    question: "Combien d'opérations SELECT sont enregistrées ?",
    categorie: "Statistiques",
    champs: ["ACTION_NAME"],
    reponse: "Il y a 200+ opérations SELECT, surtout sur SYS.OBJ$, SYS.USER$."
  },
  {
    question: "Combien d'opérations LOGON sont enregistrées ?",
    categorie: "Statistiques",
    champs: ["ACTION_NAME"],
    reponse: "Il y a environ 30 connexions LOGON distinctes."
  },
  {
    question: "Quelles tables ont été le plus souvent interrogées via SELECT ?",
    categorie: "Objets",
    champs: ["OBJECT_NAME", "ACTION_NAME"],
    reponse: "Les tables les plus consultées sont : SYS.OBJ$, SYS.USER$, SYS.TAB$, DUAL."
  },
  {
    question: "Combien d'opérations SET ROLE sont enregistrées ?",
    categorie: "Statistiques",
    champs: ["ACTION_NAME"],
    reponse: "Il y a 50+ opérations SET ROLE par rwbuilder.exe (session 2315658237)."
  },
  {
    question: "Quelles sont les tables qui ont été tronquées (TRUNCATE) ?",
    categorie: "Actions",
    champs: ["OBJECT_NAME", "ACTION_NAME"],
    reponse: "Les tables tronquées sont : IMOBILE.MOUVEMENT_UL (7x), MBUDGET.TEMP2 (5x), EPOSTE.MOUVEMENT_EPOSTE (2x)."
  },
  
  // Questions sur les objets (16-20)
  {
    question: "Quels schémas (OBJECT_SCHEMA) sont les plus actifs ?",
    categorie: "Objets",
    champs: ["OBJECT_SCHEMA"],
    reponse: "Les schémas les plus actifs sont : SYS (accès système), SPT, IMOBILE, MBUDGET, EPOSTE."
  },
  {
    question: "Quelles tables (OBJECT_NAME) sont les plus fréquemment accédées ?",
    categorie: "Objets",
    champs: ["OBJECT_NAME"],
    reponse: "Les tables les plus accédées sont : OBJ$, USER$ (système), COMPTE, MOUVEMENT_UL (métier)."
  },
  {
    question: "Y a-t-il des accès à des tables système comme SYS.OBJ$ ?",
    categorie: "Sécurité",
    champs: ["OBJECT_SCHEMA", "OBJECT_NAME"],
    reponse: "Oui, il y a des accès à SYS.OBJ$ par ATCHEMI via SQL Developer (reconnaissance de la base)."
  },
  {
    question: "Combien d'opérations concernent des objets dans le schéma SYS ?",
    categorie: "Statistiques",
    champs: ["OBJECT_SCHEMA"],
    reponse: "Il y a 150+ SELECT sur des objets du schéma SYS."
  },
  {
    question: "Quels objets ont été modifiés via UPDATE ?",
    categorie: "Actions",
    champs: ["OBJECT_NAME", "ACTION_NAME"],
    reponse: "Les objets modifiés par UPDATE sont : SPT.COMPTE (par OLA via Toad)."
  },
  
  // Questions sur les programmes clients (21-25)
  {
    question: "Quels sont les trois programmes clients les plus utilisés ?",
    categorie: "Clients",
    champs: ["CLIENT_PROGRAM_NAME"],
    reponse: "Les trois programmes les plus utilisés sont : 1) SQL Developer (ATCHEMI), 2) Toad.exe (OLA/AHOSE), 3) JDBC Thin Client (root)."
  },
  {
    question: "Combien de connexions proviennent de SQL Developer ?",
    categorie: "Statistiques",
    champs: ["CLIENT_PROGRAM_NAME"],
    reponse: "Il y a environ 100 actions via SQL Developer (majorité des SELECT système)."
  },
  {
    question: "Combien de connexions proviennent de Toad.exe ?",
    categorie: "Statistiques",
    champs: ["CLIENT_PROGRAM_NAME"],
    reponse: "Il y a environ 50 actions via Toad.exe (LOGON, UPDATE, ALTER SYSTEM)."
  },
  {
    question: "Combien de connexions utilisent JDBC Thin Client ?",
    categorie: "Statistiques",
    champs: ["CLIENT_PROGRAM_NAME"],
    reponse: "Il y a environ 20 TRUNCATE via JDBC Thin Client sur des tables métier."
  },
  {
    question: "Quelles actions sont effectuées par rwbuilder.exe ?",
    categorie: "Actions",
    champs: ["CLIENT_PROGRAM_NAME", "ACTION_NAME"],
    reponse: "rwbuilder.exe effectue uniquement des SET ROLE (session 2315658237)."
  },
  
  // Questions sur les horaires (26-30)
  {
    question: "À quelle heure de la journée y a-t-il le plus d'activité ?",
    categorie: "Temps",
    champs: ["EVENT_TIMESTAMP"],
    reponse: "Les pics d'activité sont : 11h30–12h30 (TRUNCATE) et 15h–16h (connexions)."
  },
  {
    question: "Quel est le premier événement enregistré dans le fichier ?",
    categorie: "Temps",
    champs: ["EVENT_TIMESTAMP"],
    reponse: "Le premier événement est : 11/07/2025 08:48:43 (OLA via Toad, ALTER SYSTEM)."
  },
  {
    question: "Quel est le dernier événement enregistré dans le fichier ?",
    categorie: "Temps",
    champs: ["EVENT_TIMESTAMP"],
    reponse: "Le dernier événement est : 11/07/2025 18:26:26 (AWATA via frmprod01)."
  },
  {
    question: "Y a-t-il des opérations effectuées en dehors des heures de bureau ?",
    categorie: "Temps",
    champs: ["EVENT_TIMESTAMP"],
    reponse: "Non, il n'y a pas d'activité nocturne (uniquement 8h–18h)."
  },
  {
    question: "Combien de temps dure la session la plus longue ?",
    categorie: "Sessions",
    champs: ["SESSIONID", "EVENT_TIMESTAMP"],
    reponse: "La session 604592084 (OLA) dure de 8h à 18h (10 heures)."
  },
  
  // Questions sur les adresses réseau (31-35)
  {
    question: "Quelles adresses IP (HOST dans CLIENT_ADDRESS) sont les plus actives ?",
    categorie: "Infrastructure",
    champs: ["AUTHENTICATION_TYPE"],
    reponse: "Les IPs les plus actives sont : 192.168.60.42 (Toad), 192.168.60.23 (JDBC), 192.168.200.93 (rwbuilder)."
  },
  {
    question: "Combien de connexions proviennent de 192.168.60.42 ?",
    categorie: "Statistiques",
    champs: ["AUTHENTICATION_TYPE"],
    reponse: "Il y a environ 100 connexions depuis 192.168.60.42 (Toad + SQL Developer)."
  },
  {
    question: "Quels ports sont utilisés pour les connexions ?",
    categorie: "Infrastructure",
    champs: ["AUTHENTICATION_TYPE"],
    reponse: "Exemples de ports utilisés : 50259 (Toad), 51105 (SQL Developer), 59515 (JDBC)."
  },
  {
    question: "Y a-t-il des connexions depuis des réseaux non autorisés ?",
    categorie: "Sécurité",
    champs: ["AUTHENTICATION_TYPE"],
    reponse: "Non, toutes les connexions proviennent de réseaux internes (192.168.x.x)."
  },
  {
    question: "Combien de connexions proviennent de terminaux 'unknown' ?",
    categorie: "Statistiques",
    champs: ["TERMINAL"],
    reponse: "SQL Developer utilise des terminaux 'unknown' (TERMINAL=unknown)."
  },
  
  // Questions sur les privilèges (36-40)
  {
    question: "Quels utilisateurs ont effectué des opérations DDL (CREATE, ALTER) ?",
    categorie: "Actions",
    champs: ["DBUSERNAME", "ACTION_NAME"],
    reponse: "Les utilisateurs DDL sont : OLA (ALTER SYSTEM), BATCH_USER (CREATE INDEX)."
  },
  {
    question: "Qui a créé ou modifié des procédures stockées ?",
    categorie: "Actions",
    champs: ["DBUSERNAME", "OBJECT_NAME"],
    reponse: "AHOSE a créé SUBSOLAIRE.MOON_API_DATA_VALIDATION."
  },
  {
    question: "Quels utilisateurs ont utilisé SET ROLE ?",
    categorie: "Actions",
    champs: ["DBUSERNAME", "ACTION_NAME"],
    reponse: "SET ROLE est utilisé exclusivement par rwbuilder.exe (ATCHEMI)."
  },
  {
    question: "Y a-t-il des opérations ALTER SYSTEM dans les logs ?",
    categorie: "Actions",
    champs: ["ACTION_NAME"],
    reponse: "Oui, il y a 100+ ALTER SYSTEM par OLA via Toad (session 604592084)."
  },
  {
    question: "Qui a créé des index ?",
    categorie: "Actions",
    champs: ["DBUSERNAME", "OBJECT_NAME", "ACTION_NAME"],
    reponse: "BATCH_USER a créé l'index SPT.MVO_SOLDE_CPTE_JOUR_ANCIEN_PK."
  },
  
  // Questions sur les schémas spécifiques (41-45)
  {
    question: "Combien d'opérations concernent le schéma SPT ?",
    categorie: "Statistiques",
    champs: ["OBJECT_SCHEMA"],
    reponse: "Les opérations sur SPT incluent : UPDATE COMPTE, TRUNCATE SOLDE_CPT_JR_ANCIEN."
  },
  {
    question: "Quelles tables du schéma SPT sont accédées ?",
    categorie: "Objets",
    champs: ["OBJECT_SCHEMA", "OBJECT_NAME"],
    reponse: "Les tables SPT accédées sont : COMPTE, T_INACTIF_CCP, SOLDE_CPT_JR_ANCIEN."
  },
  {
    question: "Combien d'opérations concernent le schéma EPOSTE ?",
    categorie: "Statistiques",
    champs: ["OBJECT_SCHEMA"],
    reponse: "Il y a 2 TRUNCATE MOUVEMENT_EPOSTE par l'utilisateur EPOSTE."
  },
  {
    question: "Quelles actions sont effectuées sur IMOBILE.MOUVEMENT_UL ?",
    categorie: "Actions",
    champs: ["OBJECT_SCHEMA", "OBJECT_NAME", "ACTION_NAME"],
    reponse: "Sur IMOBILE.MOUVEMENT_UL : 7 TRUNCATE par root (JDBC)."
  },
  {
    question: "Y a-t-il des opérations sur MBUDGET.TEMP2 ?",
    categorie: "Actions",
    champs: ["OBJECT_SCHEMA", "OBJECT_NAME"],
    reponse: "Oui, il y a 5 TRUNCATE sur MBUDGET.TEMP2 par GST_DEKOU."
  },
  
  // Questions sur les types d'audit (46-50)
  {
    question: "Tous les enregistrements sont-ils de type 'Standard' ?",
    categorie: "Audit",
    champs: ["AUDIT_TYPE"],
    reponse: "Oui, tous les enregistrements sont de type 'Standard'."
  },
  {
    question: "Y a-t-il des différences entre les instances (INSTANCE) ?",
    categorie: "Infrastructure",
    champs: ["INSTANCE"],
    reponse: "Tous les événements proviennent de la même instance."
  },
  {
    question: "Tous les événements proviennent-ils de 'PRODUCTION' ?",
    categorie: "Infrastructure",
    champs: ["ENVIRONMENT"],
    reponse: "Oui, tous les événements proviennent de l'environnement 'PRODUCTION'."
  },
  {
    question: "Combien d'événements sont des connexions réussies ?",
    categorie: "Statistiques",
    champs: ["ACTION_NAME"],
    reponse: "Toutes les connexions LOGON sont réussies (pas d'échecs d'authentification)."
  },
  {
    question: "Y a-t-il des échecs d'authentification ?",
    categorie: "Sécurité",
    champs: ["ACTION_NAME"],
    reponse: "Non, il n'y a pas d'échecs d'authentification enregistrés."
  },
  
  // Questions analytiques (51-55)
  {
    question: "Quelle est la fréquence des opérations TRUNCATE TABLE ?",
    categorie: "Statistiques",
    champs: ["ACTION_NAME"],
    reponse: "La fréquence des TRUNCATE est élevée : 7x sur MOUVEMENT_UL, 5x sur TEMP2, 2x sur MOUVEMENT_EPOSTE."
  },
  {
    question: "Quel utilisateur a effectué le plus de TRUNCATE TABLE ?",
    categorie: "Actions",
    champs: ["DBUSERNAME", "ACTION_NAME"],
    reponse: "L'utilisateur root a effectué le plus de TRUNCATE (via JDBC Thin Client)."
  },
  {
    question: "Combien de fois la table MOUVEMENT_UL a-t-elle été tronquée ?",
    categorie: "Statistiques",
    champs: ["OBJECT_NAME", "ACTION_NAME"],
    reponse: "La table MOUVEMENT_UL a été tronquée 7 fois par root (JDBC)."
  },
  {
    question: "Y a-t-il des patterns dans les heures des opérations TRUNCATE ?",
    categorie: "Temps",
    champs: ["EVENT_TIMESTAMP", "ACTION_NAME"],
    reponse: "Oui, les TRUNCATE sont groupés : MOUVEMENT_UL tronquée 3x en 10 minutes."
  },
  {
    question: "Combien de temps s'écoule entre deux TRUNCATE sur la même table ?",
    categorie: "Temps",
    champs: ["EVENT_TIMESTAMP", "OBJECT_NAME", "ACTION_NAME"],
    reponse: "Le temps entre TRUNCATE varie : parfois quelques minutes, parfois plusieurs heures."
  },
  
  // Questions sur les sessions (56-60)
  {
    question: "Quelle session (SESSIONID) a duré le plus longtemps ?",
    categorie: "Sessions",
    champs: ["SESSIONID", "EVENT_TIMESTAMP"],
    reponse: "La session 604592084 (OLA) a duré le plus longtemps : 8h à 18h."
  },
  {
    question: "Combien d'actions sont effectuées par session en moyenne ?",
    categorie: "Statistiques",
    champs: ["SESSIONID", "ACTION_NAME"],
    reponse: "Le nombre d'actions par session varie : certaines sessions ont des centaines d'actions."
  },
  {
    question: "Y a-t-il des sessions avec un nombre anormal d'actions ?",
    categorie: "Sécurité",
    champs: ["SESSIONID", "ACTION_NAME"],
    reponse: "Oui, la session 604592084 (OLA) a un nombre élevé d'ALTER SYSTEM."
  },
  {
    question: "Quelles sessions ont effectué à la fois SELECT et UPDATE ?",
    categorie: "Actions",
    champs: ["SESSIONID", "ACTION_NAME"],
    reponse: "Plusieurs sessions ont effectué SELECT et UPDATE, notamment celles utilisant Toad."
  },
  {
    question: "Combien de sessions proviennent du même hôte ?",
    categorie: "Infrastructure",
    champs: ["USERHOST", "SESSIONID"],
    reponse: "Plusieurs sessions proviennent du même hôte, notamment WLXREBOND et LAPOSTE\\PC-ATCHEMI."
  },
  
  // Questions sur les modifications de données (61-65)
  {
    question: "Quelles tables ont été mises à jour (UPDATE) ?",
    categorie: "Actions",
    champs: ["OBJECT_NAME", "ACTION_NAME"],
    reponse: "La table SPT.COMPTE a été mise à jour par OLA via Toad."
  },
  {
    question: "Qui a effectué des INSERT dans SPT.MOUVEMENT ?",
    categorie: "Actions",
    champs: ["DBUSERNAME", "OBJECT_NAME", "ACTION_NAME"],
    reponse: "Aucun INSERT n'est enregistré dans SPT.MOUVEMENT dans ces logs."
  },
  {
    question: "Y a-t-il des DELETE enregistrés ?",
    categorie: "Actions",
    champs: ["ACTION_NAME"],
    reponse: "Non, il n'y a pas d'opérations DELETE enregistrées dans ces logs."
  },
  {
    question: "Quelles tables ont eu des INSERT et DELETE le même jour ?",
    categorie: "Actions",
    champs: ["OBJECT_NAME", "ACTION_NAME", "EVENT_TIMESTAMP"],
    reponse: "Aucune table n'a eu d'INSERT et DELETE le même jour (pas de DELETE enregistrés)."
  },
  {
    question: "Combien d'opérations DML sont enregistrées ?",
    categorie: "Statistiques",
    champs: ["ACTION_NAME"],
    reponse: "Les opérations DML enregistrées sont : UPDATE (SPT.COMPTE) et TRUNCATE (plusieurs tables)."
  },
  
  // Questions sur les objets système (66-70)
  {
    question: "Combien d'accès à SYS.USER$ sont enregistrés ?",
    categorie: "Statistiques",
    champs: ["OBJECT_SCHEMA", "OBJECT_NAME"],
    reponse: "Il y a de nombreux accès à SYS.USER$ par ATCHEMI via SQL Developer."
  },
  {
    question: "Pourquoi y a-t-il tant d'accès à SYS.OBJ$ ?",
    categorie: "Sécurité",
    champs: ["OBJECT_SCHEMA", "OBJECT_NAME", "DBUSERNAME"],
    reponse: "Les accès à SYS.OBJ$ sont effectués par ATCHEMI via SQL Developer pour la reconnaissance de la base."
  },
  {
    question: "Quels objets système sont les plus consultés ?",
    categorie: "Objets",
    champs: ["OBJECT_SCHEMA", "OBJECT_NAME"],
    reponse: "Les objets système les plus consultés sont : SYS.OBJ$, SYS.USER$, SYS.TAB$, DUAL."
  },
  {
    question: "Y a-t-il des accès à GV$ENABLEDPRIVS ?",
    categorie: "Objets",
    champs: ["OBJECT_NAME"],
    reponse: "Non, il n'y a pas d'accès à GV$ENABLEDPRIVS dans ces logs."
  },
  {
    question: "Combien d'accès à DUAL sont enregistrés ?",
    categorie: "Statistiques",
    champs: ["OBJECT_NAME"],
    reponse: "Il y a plusieurs accès à DUAL, table système Oracle utilisée pour les requêtes simples."
  },
  
  // Questions sur les applications (71-75)
  {
    question: "Quelles applications (CLIENT_PROGRAM_NAME) accèdent à quelles tables ?",
    categorie: "Applications",
    champs: ["CLIENT_PROGRAM_NAME", "OBJECT_NAME"],
    reponse: "SQL Developer accède aux tables système, Toad aux tables métier, JDBC aux tables de données."
  },
  {
    question: "SQL Developer est-il utilisé pour des opérations administratives ?",
    categorie: "Applications",
    champs: ["CLIENT_PROGRAM_NAME", "ACTION_NAME"],
    reponse: "Oui, SQL Developer est utilisé par ATCHEMI pour des opérations administratives (accès SYS)."
  },
  {
    question: "Toad.exe est-il utilisé pour des opérations spécifiques ?",
    categorie: "Applications",
    champs: ["CLIENT_PROGRAM_NAME", "ACTION_NAME"],
    reponse: "Oui, Toad.exe est utilisé par OLA pour ALTER SYSTEM et UPDATE sur SPT.COMPTE."
  },
  {
    question: "JDBC Thin Client est-il utilisé pour des opérations batch ?",
    categorie: "Applications",
    champs: ["CLIENT_PROGRAM_NAME", "ACTION_NAME"],
    reponse: "Oui, JDBC Thin Client est utilisé par root pour des TRUNCATE (opérations batch)."
  },
  {
    question: "rwbuilder.exe est-il utilisé pour des opérations particulières ?",
    categorie: "Applications",
    champs: ["CLIENT_PROGRAM_NAME", "ACTION_NAME"],
    reponse: "Oui, rwbuilder.exe est utilisé exclusivement pour des SET ROLE (session 2315658237)."
  },
  
  // Questions de sécurité (76-80)
  {
    question: "Y a-t-il des accès suspects à des tables système ?",
    categorie: "Sécurité",
    champs: ["OBJECT_SCHEMA", "DBUSERNAME"],
    reponse: "Oui, ATCHEMI accède de manière excessive aux tables système via SQL Developer."
  },
  {
    question: "Des utilisateurs normaux accèdent-ils à des objets SYS ?",
    categorie: "Sécurité",
    champs: ["OBJECT_SCHEMA", "DBUSERNAME"],
    reponse: "Oui, ATCHEMI (utilisateur normal) accède aux objets SYS via SQL Developer."
  },
  {
    question: "Y a-t-il des opérations sensibles effectuées par des applications ?",
    categorie: "Sécurité",
    champs: ["CLIENT_PROGRAM_NAME", "ACTION_NAME"],
    reponse: "Oui, JDBC effectue des TRUNCATE et Toad effectue des ALTER SYSTEM."
  },
  {
    question: "Les TRUNCATE sont-ils effectués par des utilisateurs appropriés ?",
    categorie: "Sécurité",
    champs: ["DBUSERNAME", "ACTION_NAME"],
    reponse: "Les TRUNCATE sont effectués par root et BATCH_USER, ce qui semble approprié mais la fréquence est élevée."
  },
  {
    question: "Y a-t-il des connexions depuis des hôtes non autorisés ?",
    categorie: "Sécurité",
    champs: ["USERHOST", "AUTHENTICATION_TYPE"],
    reponse: "Non, toutes les connexions proviennent de réseaux internes autorisés (192.168.x.x)."
  },
  
  // Questions temporelles (81-85)
  {
    question: "Quel est le pic d'activité dans la journée ?",
    categorie: "Temps",
    champs: ["EVENT_TIMESTAMP"],
    reponse: "Les pics d'activité sont : 11h–12h et 15h–16h."
  },
  {
    question: "Y a-t-il des opérations la nuit ?",
    categorie: "Temps",
    champs: ["EVENT_TIMESTAMP"],
    reponse: "Non, il n'y a pas d'opérations nocturnes (uniquement 8h–18h)."
  },
  {
    question: "Combien de temps entre le premier et le dernier événement ?",
    categorie: "Temps",
    champs: ["EVENT_TIMESTAMP"],
    reponse: "Il y a 10 heures entre le premier (8h48) et le dernier événement (18h26)."
  },
  {
    question: "Les opérations TRUNCATE sont-elles groupées dans le temps ?",
    categorie: "Temps",
    champs: ["EVENT_TIMESTAMP", "ACTION_NAME"],
    reponse: "Oui, les TRUNCATE sont groupés : MOUVEMENT_UL tronquée 3x en 10 minutes."
  },
  {
    question: "Y a-t-il des sessions qui durent plusieurs heures ?",
    categorie: "Sessions",
    champs: ["SESSIONID", "EVENT_TIMESTAMP"],
    reponse: "Oui, la session 604592084 (OLA) dure de 8h à 18h (10 heures)."
  },
  
  // Questions sur les rôles (86-90)
  {
    question: "Combien de fois SET ROLE est-il appelé ?",
    categorie: "Statistiques",
    champs: ["ACTION_NAME"],
    reponse: "SET ROLE est appelé 50+ fois par rwbuilder.exe."
  },
  {
    question: "Quels utilisateurs utilisent SET ROLE ?",
    categorie: "Actions",
    champs: ["DBUSERNAME", "ACTION_NAME"],
    reponse: "SET ROLE est utilisé uniquement par ATCHEMI via rwbuilder.exe."
  },
  {
    question: "Y a-t-il des patterns dans l'utilisation de SET ROLE ?",
    categorie: "Actions",
    champs: ["EVENT_TIMESTAMP", "ACTION_NAME"],
    reponse: "Oui, les SET ROLE sont groupés en rafales (ex: 10x en 1 minute)."
  },
  {
    question: "SET ROLE est-il utilisé avec des applications spécifiques ?",
    categorie: "Applications",
    champs: ["CLIENT_PROGRAM_NAME", "ACTION_NAME"],
    reponse: "Oui, SET ROLE est utilisé exclusivement avec rwbuilder.exe."
  },
  {
    question: "Combien de SET ROLE par session en moyenne ?",
    categorie: "Statistiques",
    champs: ["SESSIONID", "ACTION_NAME"],
    reponse: "Il y a environ 20 SET ROLE par session 2315658237."
  },
  
  // Questions sur les schémas (91-95)
  {
    question: "Quels schémas contiennent des tables tronquées ?",
    categorie: "Objets",
    champs: ["OBJECT_SCHEMA", "ACTION_NAME"],
    reponse: "Les schémas avec TRUNCATE sont : IMOBILE, MBUDGET, EPOSTE, SPT."
  },
  {
    question: "Le schéma SPT est-il utilisé pour quels types d'opérations ?",
    categorie: "Actions",
    champs: ["OBJECT_SCHEMA", "ACTION_NAME"],
    reponse: "Le schéma SPT est utilisé pour : UPDATE COMPTE, TRUNCATE SOLDE_CPT_JR_ANCIEN."
  },
  {
    question: "Qui accède au schéma IMOBILE ?",
    categorie: "Actions",
    champs: ["OBJECT_SCHEMA", "DBUSERNAME"],
    reponse: "Seul root accède au schéma IMOBILE (uniquement pour TRUNCATE MOUVEMENT_UL)."
  },
  {
    question: "Y a-t-il des opérations croisées entre schémas ?",
    categorie: "Actions",
    champs: ["OBJECT_SCHEMA", "DBUSERNAME"],
    reponse: "Non, les schémas sont utilisés de manière isolée par des utilisateurs différents."
  },
  {
    question: "Quel schéma a le plus d'opérations UPDATE ?",
    categorie: "Statistiques",
    champs: ["OBJECT_SCHEMA", "ACTION_NAME"],
    reponse: "Le schéma SPT a le plus d'opérations UPDATE (table COMPTE)."
  },
  
  // Questions techniques (96-100)
  {
    question: "Comment est structuré le champ AUTHENTICATION_TYPE ?",
    categorie: "Technique",
    champs: ["AUTHENTICATION_TYPE"],
    reponse: "Le format est : (TYPE=(DATABASE)) + adresse TCP avec port."
  },
  {
    question: "Que représente le champ TERMINAL ?",
    categorie: "Technique",
    champs: ["TERMINAL"],
    reponse: "TERMINAL représente : PC-ATCHEMI, WLXREBOND, ou 'unknown' pour SQL Developer."
  },
  {
    question: "Comment interpréter les timestamps avec microsecondes ?",
    categorie: "Technique",
    champs: ["EVENT_TIMESTAMP"],
    reponse: "Le format est : DD/MM/YYYY HH:MM:SS,ssssss (avec microsecondes)."
  },
  {
    question: "Quelle est la signification des IDs en première colonne ?",
    categorie: "Technique",
    champs: ["ID"],
    reponse: "Les IDs sont des identifiants uniques séquentiels (ex: 103103014481)."
  },
  {
    question: "Comment sont générés les SESSIONID ?",
    categorie: "Technique",
    champs: ["SESSIONID"],
    reponse: "Les SESSIONID sont apparemment générés de manière aléatoire (ex: 994729870)."
  },

  // === QUESTIONS EXISTANTES ===
  {
    question: "Quels sont les utilisateurs système (os_username) ayant accédé à la base aujourd'hui ?",
    categorie: "Accès",
    champs: ["OS_USERNAME", "EVENT_TIMESTAMP"],
    reponse: "Les utilisateurs système ayant accédé à la base aujourd'hui sont : [liste des OS_USERNAME]."
  },
  {
    question: "Combien d’opérations SELECT ont été effectuées aujourd’hui ?",
    categorie: "Statistiques",
    champs: ["ACTION_NAME", "EVENT_TIMESTAMP"],
    reponse: "Il y a eu [nombre] opérations SELECT aujourd'hui."
  },
  {
    question: "Quels objets du schéma SYS ont été accédés ?",
    categorie: "Objets",
    champs: ["OBJECT_SCHEMA", "OBJECT_NAME"],
    reponse: "Les objets du schéma SYS accédés sont : [liste des OBJECT_NAME]."
  },
  {
    question: "Quelle machine a généré le plus d'accès à la base ?",
    categorie: "Infrastructure",
    champs: ["USERHOST"],
    reponse: "La machine ayant généré le plus d'accès est : [USERHOST]."
  },
  {
    question: "Quels programmes clients (client_program_name) ont été utilisés ?",
    categorie: "Clients",
    champs: ["CLIENT_PROGRAM_NAME"],
    reponse: "Les programmes clients utilisés sont : [liste des CLIENT_PROGRAM_NAME]."
  },
  {
    question: "Quels utilisateurs Oracle (dbusername) ont accédé au schéma SYS ?",
    categorie: "Utilisateurs",
    champs: ["DBUSERNAME", "OBJECT_SCHEMA"],
    reponse: "Les utilisateurs Oracle ayant accédé au schéma SYS sont : [liste des DBUSERNAME]."
  },
  {
    question: "Quels types d’actions (action_name) ont été effectuées aujourd’hui ?",
    categorie: "Actions",
    champs: ["ACTION_NAME", "EVENT_TIMESTAMP"],
    reponse: "Les types d'actions effectuées aujourd'hui sont : [liste des ACTION_NAME]."
  },
  {
    question: "Qui a exécuté une requête sur la séquence SEQ$ ?",
    categorie: "Objets",
    champs: ["DBUSERNAME", "OBJECT_NAME"],
    reponse: "Les utilisateurs ayant exécuté une requête sur SEQ$ sont : [liste des DBUSERNAME]."
  },
  {
    question: "Quelles sont les adresses IP ayant accédé à la base ?",
    categorie: "Infrastructure",
    champs: ["AUTHENTICATION_TYPE"],
    reponse: "Les adresses IP ayant accédé à la base sont : [liste des IP]."
  },
  {
    question: "À quelle heure a eu lieu le premier accès à la base aujourd’hui ?",
    categorie: "Temps",
    champs: ["EVENT_TIMESTAMP"],
    reponse: "Le premier accès à la base aujourd'hui a eu lieu à : [heure]."
  },
  // Questions temporelles
  {
    question: "Quelles actions ont été réalisées par l'utilisateur ATCHEMI le 11/07/2025 ?",
    categorie: "Temps",
    champs: ["DBUSERNAME", "ACTION_NAME", "EVENT_TIMESTAMP"],
    reponse: "Les actions réalisées par ATCHEMI le 11/07/2025 sont : [liste des ACTION_NAME]."
  },
  {
    question: "Quels accès ont été faits entre 11:00 et 11:35 ?",
    categorie: "Temps",
    champs: ["EVENT_TIMESTAMP"],
    reponse: "Les accès faits entre 11:00 et 11:35 sont : [liste des accès]."
  },
  {
    question: "Quelle a été la dernière action enregistrée dans les logs ?",
    categorie: "Temps",
    champs: ["ACTION_NAME", "EVENT_TIMESTAMP"],
    reponse: "La dernière action enregistrée est : [ACTION_NAME] à [EVENT_TIMESTAMP]."
  },
  {
    question: "Quelle action a été la plus fréquente cette semaine ?",
    categorie: "Statistiques",
    champs: ["ACTION_NAME", "EVENT_TIMESTAMP"],
    reponse: "L'action la plus fréquente cette semaine est : [ACTION_NAME]."
  },
  {
    question: "Quelle adresse IP s’est connectée le plus de fois ce mois-ci ?",
    categorie: "Infrastructure",
    champs: ["AUTHENTICATION_TYPE", "EVENT_TIMESTAMP"],
    reponse: "L'adresse IP la plus active ce mois-ci est : [IP]."
  },
  {
    question: "Qui a exécuté la dernière requête SELECT du jour ?",
    categorie: "Actions",
    champs: ["DBUSERNAME", "ACTION_NAME", "EVENT_TIMESTAMP"],
    reponse: "La dernière requête SELECT du jour a été exécutée par : [DBUSERNAME]."
  },
  // Questions sur les utilisateurs
  {
    question: "Quel utilisateur Oracle a effectué le plus d’actions ?",
    categorie: "Utilisateurs",
    champs: ["DBUSERNAME", "ACTION_NAME"],
    reponse: "L'utilisateur Oracle ayant effectué le plus d'actions est : [DBUSERNAME]."
  },
  {
    question: "Combien d’actions ont été effectuées par datchemi ?",
    categorie: "Utilisateurs",
    champs: ["DBUSERNAME", "ACTION_NAME"],
    reponse: "datchemi a effectué [nombre] actions."
  },
  {
    question: "Quelles sont les différentes machines utilisées par datchemi ?",
    categorie: "Utilisateurs",
    champs: ["DBUSERNAME", "USERHOST"],
    reponse: "Les machines utilisées par datchemi sont : [liste des USERHOST]."
  },
  {
    question: "ATCHEMI a-t-il accédé à d'autres objets que SEQ$ et SUM$ ?",
    categorie: "Objets",
    champs: ["DBUSERNAME", "OBJECT_NAME"],
    reponse: "ATCHEMI a accédé aux objets suivants (hors SEQ$ et SUM$) : [liste des OBJECT_NAME]."
  },
  {
    question: "Quels utilisateurs ont utilisé SQL Developer ?",
    categorie: "Clients",
    champs: ["DBUSERNAME", "CLIENT_PROGRAM_NAME"],
    reponse: "Les utilisateurs ayant utilisé SQL Developer sont : [liste des DBUSERNAME]."
  },
  {
    question: "Quels utilisateurs ont utilisé des terminaux inconnus ?",
    categorie: "Infrastructure",
    champs: ["DBUSERNAME", "TERMINAL"],
    reponse: "Les utilisateurs ayant utilisé des terminaux inconnus sont : [liste des DBUSERNAME]."
  },
  {
    question: "Y a-t-il un utilisateur qui accède fréquemment aux objets du schéma SYS ?",
    categorie: "Objets",
    champs: ["DBUSERNAME", "OBJECT_SCHEMA"],
    reponse: "Les utilisateurs accédant fréquemment au schéma SYS sont : [liste des DBUSERNAME]."
  },
  // Questions sur les objets et schémas
  {
    question: "Combien d’objets différents ont été accédés ?",
    categorie: "Objets",
    champs: ["OBJECT_NAME"],
    reponse: "Le nombre d'objets différents accédés est : [nombre]."
  },
  {
    question: "Quelles séquences (SEQ$) ont été consultées ?",
    categorie: "Objets",
    champs: ["OBJECT_NAME"],
    reponse: "Les séquences SEQ$ consultées sont : [liste des OBJECT_NAME]."
  },
  {
    question: "Quels objets sont accédés par plusieurs utilisateurs ?",
    categorie: "Objets",
    champs: ["OBJECT_NAME", "DBUSERNAME"],
    reponse: "Les objets accédés par plusieurs utilisateurs sont : [liste des OBJECT_NAME]."
  },
  {
    question: "Y a-t-il eu des accès non autorisés aux objets système ?",
    categorie: "Sécurité",
    champs: ["OBJECT_SCHEMA", "DBUSERNAME"],
    reponse: "Les accès non autorisés aux objets système sont : [liste des accès]."
  },
  {
    question: "Quels objets du schéma SYS sont consultés le plus souvent ?",
    categorie: "Objets",
    champs: ["OBJECT_SCHEMA", "OBJECT_NAME"],
    reponse: "Les objets du schéma SYS les plus consultés sont : [liste des OBJECT_NAME]."
  },
  {
    question: "Le schéma SYS est-il souvent ciblé par des requêtes SELECT ?",
    categorie: "Objets",
    champs: ["OBJECT_SCHEMA", "ACTION_NAME"],
    reponse: "Le schéma SYS est ciblé par [nombre] requêtes SELECT."
  },
  {
    question: "Quels objets sont fréquemment accédés entre 11h et 12h ?",
    categorie: "Objets",
    champs: ["OBJECT_NAME", "EVENT_TIMESTAMP"],
    reponse: "Les objets fréquemment accédés entre 11h et 12h sont : [liste des OBJECT_NAME]."
  },
  // Questions sur l’infrastructure
  {
    question: "Quelle IP a généré le plus de trafic ?",
    categorie: "Infrastructure",
    champs: ["AUTHENTICATION_TYPE"],
    reponse: "L'IP ayant généré le plus de trafic est : [IP]."
  },
  {
    question: "L’adresse IP 192.168.60.42 a-t-elle accédé à d’autres objets ?",
    categorie: "Infrastructure",
    champs: ["AUTHENTICATION_TYPE", "OBJECT_NAME"],
    reponse: "L'adresse IP 192.168.60.42 a accédé aux objets suivants : [liste des OBJECT_NAME]."
  },
  {
    question: "Quels utilisateurs sont associés à l’hôte WLXREBOND ?",
    categorie: "Infrastructure",
    champs: ["USERHOST", "DBUSERNAME"],
    reponse: "Les utilisateurs associés à WLXREBOND sont : [liste des DBUSERNAME]."
  },
  {
    question: "Quelles actions ont été effectuées depuis le port 51105 ?",
    categorie: "Infrastructure",
    champs: ["AUTHENTICATION_TYPE", "ACTION_NAME"],
    reponse: "Les actions effectuées depuis le port 51105 sont : [liste des ACTION_NAME]."
  },
  {
    question: "Combien d’actions ont été réalisées depuis le terminal unknown ?",
    categorie: "Infrastructure",
    champs: ["TERMINAL", "ACTION_NAME"],
    reponse: "Le nombre d'actions depuis le terminal unknown est : [nombre]."
  },
  {
    question: "Est-ce que l'adresse 192.168.60.42 a tenté d’accéder à des objets sensibles ?",
    categorie: "Sécurité",
    champs: ["AUTHENTICATION_TYPE", "OBJECT_NAME"],
    reponse: "L'adresse 192.168.60.42 a tenté d'accéder aux objets sensibles suivants : [liste des OBJECT_NAME]."
  },
  // Questions d’analyse et d’alerte
  {
    question: "Y a-t-il des pics d’activité inhabituels ?",
    categorie: "Analyse",
    champs: ["EVENT_TIMESTAMP", "ACTION_NAME"],
    reponse: "Des pics d'activité inhabituels ont été détectés à : [liste des heures]."
  },
  {
    question: "Y a-t-il des accès répétés à un objet critique comme SYS.SUM$ ?",
    categorie: "Analyse",
    champs: ["OBJECT_NAME", "ACTION_NAME"],
    reponse: "Des accès répétés à SYS.SUM$ ont été détectés : [nombre]."
  },
  {
    question: "Quel utilisateur a tenté d’accéder plusieurs fois à des objets système ?",
    categorie: "Sécurité",
    champs: ["DBUSERNAME", "OBJECT_SCHEMA"],
    reponse: "L'utilisateur ayant tenté plusieurs accès aux objets système est : [DBUSERNAME]."
  },
  {
    question: "Peut-on détecter une activité suspecte à une heure inhabituelle ?",
    categorie: "Sécurité",
    champs: ["EVENT_TIMESTAMP", "ACTION_NAME"],
    reponse: "Des activités suspectes ont été détectées à : [liste des heures]."
  },
  {
    question: "Y a-t-il des utilisateurs qui accèdent au système via des IP internes uniquement ?",
    categorie: "Sécurité",
    champs: ["DBUSERNAME", "AUTHENTICATION_TYPE"],
    reponse: "Les utilisateurs accédant uniquement via IP internes sont : [liste des DBUSERNAME]."
  },
  {
    question: "Un utilisateur a-t-il utilisé plusieurs adresses IP dans une même journée ?",
    categorie: "Sécurité",
    champs: ["DBUSERNAME", "AUTHENTICATION_TYPE", "EVENT_TIMESTAMP"],
    reponse: "Les utilisateurs ayant utilisé plusieurs IP dans une journée sont : [liste des DBUSERNAME]."
  },
  {
    question: "Quels objets sont accédés sans cohérence avec le profil de l’utilisateur ?",
    categorie: "Analyse",
    champs: ["DBUSERNAME", "OBJECT_NAME"],
    reponse: "Les objets accédés sans cohérence sont : [liste des OBJECT_NAME]."
  },
  {
    question: "Peut-on détecter un comportement anormal dans les accès d’aujourd’hui ?",
    categorie: "Analyse",
    champs: ["DBUSERNAME", "ACTION_NAME", "EVENT_TIMESTAMP"],
    reponse: "Des comportements anormaux ont été détectés pour : [liste des DBUSERNAME]."
  },
  {
    question: "Quelles actions sont les plus fréquentes pour chaque utilisateur ?",
    categorie: "Statistiques",
    champs: ["DBUSERNAME", "ACTION_NAME"],
    reponse: "Les actions les plus fréquentes par utilisateur sont : [tableau DBUSERNAME/ACTION_NAME]."
  },
  // Questions pour un chatbot intelligent
  {
    question: "Quel est le comportement typique de l’utilisateur ATCHEMI ?",
    categorie: "Analyse",
    champs: ["DBUSERNAME", "ACTION_NAME", "OBJECT_NAME"],
    reponse: "Le comportement typique d'ATCHEMI est : [description synthétique]."
  },
  {
    question: "Donne-moi une analyse synthétique des accès du 11/07/2025.",
    categorie: "Analyse",
    champs: ["EVENT_TIMESTAMP", "ACTION_NAME", "OBJECT_NAME", "DBUSERNAME"],
    reponse: "Analyse synthétique des accès du 11/07/2025 : [résumé]."
  },
  {
    question: "Y a-t-il des incohérences ou anomalies dans les journaux d’accès ?",
    categorie: "Analyse",
    champs: ["ACTION_NAME", "OBJECT_NAME", "EVENT_TIMESTAMP"],
    reponse: "Les incohérences ou anomalies détectées sont : [liste]."
  },
  // 50 questions avancées (analyse, corrélation, patterns, filtrage, stats, sécurité)
  {
    question: "Quels objets sont consultés régulièrement tous les jours à la même heure ?",
    categorie: "Tendances",
    champs: ["OBJECT_NAME", "EVENT_TIMESTAMP"],
    reponse: "Les objets consultés régulièrement à la même heure sont : [liste des OBJECT_NAME]."
  },
  {
    question: "Y a-t-il une tendance d’augmentation des requêtes SELECT sur les objets SYS ?",
    categorie: "Tendances",
    champs: ["OBJECT_SCHEMA", "ACTION_NAME", "EVENT_TIMESTAMP"],
    reponse: "Tendance d'augmentation des requêtes SELECT sur SYS : [résumé/statistiques]."
  },
  {
    question: "Quels utilisateurs ont des schémas de comportement irréguliers ?",
    categorie: "Tendances",
    champs: ["DBUSERNAME", "ACTION_NAME", "EVENT_TIMESTAMP"],
    reponse: "Les utilisateurs avec des comportements irréguliers sont : [liste des DBUSERNAME]."
  },
  {
    question: "L’adresse IP 192.168.60.42 est-elle active en dehors des horaires de travail ?",
    categorie: "Infrastructure",
    champs: ["AUTHENTICATION_TYPE", "EVENT_TIMESTAMP"],
    reponse: "L'adresse IP 192.168.60.42 est active en dehors des horaires de travail : [oui/non, détails]."
  },
  {
    question: "Quels utilisateurs accèdent aux objets système depuis des terminaux unknown ?",
    categorie: "Sécurité",
    champs: ["DBUSERNAME", "OBJECT_SCHEMA", "TERMINAL"],
    reponse: "Les utilisateurs accédant aux objets système depuis des terminaux unknown sont : [liste des DBUSERNAME]."
  },
  {
    question: "Quel est le volume moyen d’opérations SELECT par utilisateur ?",
    categorie: "Statistiques",
    champs: ["DBUSERNAME", "ACTION_NAME"],
    reponse: "Le volume moyen d'opérations SELECT par utilisateur est : [tableau DBUSERNAME/nombre]."
  },
  {
    question: "Peut-on prédire le prochain objet consulté par ATCHEMI ?",
    categorie: "Tendances",
    champs: ["DBUSERNAME", "OBJECT_NAME", "EVENT_TIMESTAMP"],
    reponse: "Le prochain objet consulté par ATCHEMI pourrait être : [OBJECT_NAME]."
  },
  {
    question: "Quelle plage horaire est la plus active en termes de connexions ?",
    categorie: "Statistiques",
    champs: ["EVENT_TIMESTAMP"],
    reponse: "La plage horaire la plus active est : [heure/plage]."
  },
  {
    question: "Quel est l’objet le plus souvent consulté par chaque programme client ?",
    categorie: "Statistiques",
    champs: ["CLIENT_PROGRAM_NAME", "OBJECT_NAME"],
    reponse: "L'objet le plus consulté par chaque programme client est : [tableau CLIENT_PROGRAM_NAME/OBJECT_NAME]."
  },
  {
    question: "Quelle combinaison userhost/object_name est la plus fréquente ?",
    categorie: "Statistiques",
    champs: ["USERHOST", "OBJECT_NAME"],
    reponse: "La combinaison la plus fréquente est : [USERHOST/OBJECT_NAME]."
  },
  // ... (continuer avec les autres questions avancées, patterns, filtrage, stats, sécurité)
  // Pour la lisibilité, tu peux compléter la liste en suivant ce format pour chaque question.
];

// Fonction utilitaire pour matcher une question et générer la réponse structurée
// logs: tableau d'objets log d'audit Oracle
// question: string posée par l'utilisateur
// Retourne un objet { type, data, columns, summary, explanation }
function answerQuestion(logs, question) {
  const normalizedQuestion = question.toLowerCase().trim();
  
  // Vérifier que nous avons des données
  if (!logs || !Array.isArray(logs) || logs.length === 0) {
    return {
      type: 'error',
      data: null,
      columns: [],
      summary: 'Aucune donnée disponible',
      explanation: 'Aucune donnée d\'audit n\'est disponible pour l\'analyse.'
    };
  }
  
  // Analyser directement les données MongoDB (champs en minuscules)
  const users = [...new Set(logs.map(l => l.dbusername).filter(Boolean))];
  const actions = [...new Set(logs.map(l => l.action_name).filter(Boolean))];
  const objects = [...new Set(logs.map(l => l.object_name).filter(Boolean))];
  const programs = [...new Set(logs.map(l => l.client_program_name).filter(Boolean))];
  const schemas = [...new Set(logs.map(l => l.object_schema).filter(Boolean))];
  
  console.log(`DEBUG: ${users.length} utilisateurs trouvés: ${users.join(', ')}`);
  console.log(`DEBUG: ${actions.length} actions trouvées: ${actions.join(', ')}`);
  console.log(`DEBUG: ${objects.length} objets trouvés`);
  console.log(`DEBUG: ${programs.length} programmes trouvés: ${programs.join(', ')}`);
  console.log(`DEBUG: ${schemas.length} schémas trouvés: ${schemas.join(', ')}`);
  
  // Utiliser le nouveau module d'analyse pour les analyses avancées
  const DataAnalyzer = require('./dataAnalyzer');
  const analyzer = new DataAnalyzer();
  
  // Charger et analyser les données
  if (!analyzer.loadData(logs)) {
    console.log('DEBUG: Échec du chargement des données dans l\'analyseur');
  }
  
  const analysis = analyzer.analyzeAll();
  const patterns = analyzer.findSuspiciousPatterns();
  
  // Recherche du template correspondant avec matching plus flexible
  let template = questionTemplates.find(qt => qt.question.toLowerCase() === normalizedQuestion);
  
  // Si pas de match exact, chercher par similarité
  if (!template) {
    template = questionTemplates.find(qt => {
      const templateWords = qt.question.toLowerCase().split(' ');
      const questionWords = normalizedQuestion.split(' ');
      const matchingWords = templateWords.filter(word => 
        questionWords.some(qWord => qWord.includes(word) || word.includes(qWord))
      );
      return matchingWords.length >= 2; // Au moins 2 mots en commun
    });
  }
  
  // Si toujours pas trouvé, chercher par catégorie
  if (!template) {
    const categories = ['utilisateur', 'action', 'objet', 'sécurité', 'statistique', 'temps', 'accès', 'client', 'infrastructure'];
    const matchingCategory = categories.find(cat => normalizedQuestion.includes(cat));
    if (matchingCategory) {
      template = questionTemplates.find(qt => qt.categorie.toLowerCase().includes(matchingCategory));
    }
  }

  // Analyse spécifique basée sur les mots-clés dans la question
  let result = null;
  let columns = [];
  let type = 'text';
  let summary = '';
  let explanation = '';

  // Questions sur SQL Developer
  if (normalizedQuestion.includes('sql developer')) {
    const sqlDeveloperUsers = [...new Set(logs.filter(l => l.client_program_name === 'SQL Developer').map(l => l.dbusername).filter(Boolean))];
    result = sqlDeveloperUsers;
    summary = `Les utilisateurs ayant utilisé SQL Developer sont : ${sqlDeveloperUsers.join(', ')}`;
    explanation = 'Liste des utilisateurs Oracle qui ont utilisé SQL Developer comme client.';
  }
  // Questions sur les terminaux inconnus
  else if (normalizedQuestion.includes('terminal') && (normalizedQuestion.includes('inconnu') || normalizedQuestion.includes('unknown'))) {
    const unknownTerminalUsers = [...new Set(logs.filter(l => l.terminal === 'unknown').map(l => l.dbusername).filter(Boolean))];
    result = unknownTerminalUsers;
    summary = `Les utilisateurs ayant utilisé des terminaux inconnus sont : ${unknownTerminalUsers.join(', ')}`;
    explanation = 'Utilisateurs qui se sont connectés via des terminaux non identifiés.';
  }
  // Questions sur le schéma SYS
  else if (normalizedQuestion.includes('schéma sys') || normalizedQuestion.includes('objet sys')) {
    const sysUsers = [...new Set(logs.filter(l => l.object_schema === 'SYS').map(l => l.dbusername).filter(Boolean))];
    const sysAccessCount = logs.filter(l => l.object_schema === 'SYS').length;
    result = {
      utilisateurs: sysUsers,
      nombre_acces: sysAccessCount,
      objets_sys: [...new Set(logs.filter(l => l.object_schema === 'SYS').map(l => l.object_name).filter(Boolean))]
    };
    summary = `Les utilisateurs accédant au schéma SYS sont : ${sysUsers.join(', ')} (${sysAccessCount} accès total)`;
    explanation = 'Analyse des accès au schéma système SYS.';
  }
  // Questions sur les objets fréquemment accédés
  else if (normalizedQuestion.includes('objet') && (normalizedQuestion.includes('fréquemment') || normalizedQuestion.includes('souvent'))) {
    const objectFreq = {};
    logs.forEach(l => {
      const objectName = l.object_name;
      if (objectName) {
        objectFreq[objectName] = (objectFreq[objectName] || 0) + 1;
      }
    });
    const frequentObjects = Object.entries(objectFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([obj, count]) => ({ objet: obj, acces: count }));
    
    result = frequentObjects;
    columns = ['Objet', 'Nombre d\'accès'];
    type = 'table';
    summary = `Les objets les plus fréquemment accédés sont : ${frequentObjects.slice(0, 5).map(o => o.objet).join(', ')}`;
    explanation = 'Top 10 des objets les plus consultés dans la base de données.';
  }
  // Questions sur les ports
  else if (normalizedQuestion.includes('port')) {
    const portActions = logs.filter(l => l.AUTHENTICATION_TYPE && l.AUTHENTICATION_TYPE.includes('PORT='));
    const actions = [...new Set(portActions.map(l => l.ACTION_NAME).filter(Boolean))];
    result = actions;
    summary = `Les actions effectuées via des ports sont : ${actions.join(', ')}`;
    explanation = 'Actions détectées via des connexions portuaires.';
  }
  // Questions sur les terminaux unknown
  else if (normalizedQuestion.includes('terminal unknown') || normalizedQuestion.includes('terminal inconnu')) {
    const unknownTerminalActions = logs.filter(l => l.terminal === 'unknown');
    const actionCount = unknownTerminalActions.length;
    const actions = [...new Set(unknownTerminalActions.map(l => l.action_name).filter(Boolean))];
    result = {
      nombre_actions: actionCount,
      types_actions: actions,
      utilisateurs: [...new Set(unknownTerminalActions.map(l => l.dbusername).filter(Boolean))]
    };
    summary = `Nombre d'actions depuis le terminal unknown : ${actionCount} (${actions.join(', ')})`;
    explanation = 'Actions effectuées depuis des terminaux non identifiés.';
  }
  // Questions sur les adresses IP
  else if (normalizedQuestion.includes('192.168.60.42') || normalizedQuestion.includes('adresse')) {
    const ipLogs = logs.filter(l => l.authentication_type && l.authentication_type.includes('192.168.60.42'));
    const sensitiveObjects = [...new Set(ipLogs.filter(l => 
      l.object_schema === 'SYS' || l.object_name?.includes('$') || l.object_name?.includes('DBA_')
    ).map(l => l.object_name).filter(Boolean))];
    
    result = {
      nombre_acces: ipLogs.length,
      objets_sensibles: sensitiveObjects,
      actions: [...new Set(ipLogs.map(l => l.action_name).filter(Boolean))]
    };
    summary = `L'adresse 192.168.60.42 a effectué ${ipLogs.length} accès. Objets sensibles : ${sensitiveObjects.join(', ')}`;
    explanation = 'Analyse des accès depuis cette adresse IP spécifique.';
  }
  // Questions sur les comportements anormaux
  else if (normalizedQuestion.includes('comportement anormal') || normalizedQuestion.includes('anomalie')) {
    const anomalies = [];
    
    // Détecter les accès multiples au même objet
    const objectAccess = {};
    logs.forEach(l => {
      if (l.object_name) {
        if (!objectAccess[l.object_name]) objectAccess[l.object_name] = [];
        objectAccess[l.object_name].push(l.dbusername);
      }
    });
    
    const suspiciousObjects = Object.entries(objectAccess)
      .filter(([obj, users]) => users.length > 3)
      .map(([obj, users]) => ({ objet: obj, utilisateurs: [...new Set(users)] }));
    
    // Détecter les actions DELETE suspectes
    const deleteActions = logs.filter(l => l.action_name === 'DELETE');
    
    result = {
      objets_suspects: suspiciousObjects,
      actions_delete: deleteActions.length,
      utilisateurs_delete: [...new Set(deleteActions.map(l => l.dbusername).filter(Boolean))]
    };
    summary = `Comportements anormaux détectés : ${suspiciousObjects.length} objets suspects, ${deleteActions.length} actions DELETE`;
    explanation = 'Analyse des comportements suspects dans les logs d\'audit.';
  }
  // Questions sur les actions les plus fréquentes par utilisateur
  else if (normalizedQuestion.includes('action') && normalizedQuestion.includes('fréquent') && normalizedQuestion.includes('utilisateur')) {
    const userActions = {};
    logs.forEach(l => {
      if (l.dbusername && l.action_name) {
        if (!userActions[l.dbusername]) userActions[l.dbusername] = {};
        userActions[l.dbusername][l.action_name] = (userActions[l.dbusername][l.action_name] || 0) + 1;
      }
    });
    
    const topActionsPerUser = Object.entries(userActions).map(([user, actions]) => {
      const topAction = Object.entries(actions).sort((a, b) => b[1] - a[1])[0];
      return {
        utilisateur: user,
        action_principale: topAction[0],
        nombre_actions: topAction[1]
      };
    });
    
    result = topActionsPerUser;
    columns = ['Utilisateur', 'Action Principale', 'Nombre d\'Actions'];
    type = 'table';
    summary = `Actions les plus fréquentes par utilisateur analysées`;
    explanation = 'Analyse des actions dominantes pour chaque utilisateur.';
  }
  // Questions sur les utilisateurs en général
  else if (normalizedQuestion.includes('utilisateur') || normalizedQuestion.includes('qui')) {
    result = users;
    summary = `Utilisateurs détectés : ${users.join(', ')}`;
    explanation = 'Liste des utilisateurs Oracle ayant accédé à la base de données.';
  }
  // Questions sur les actions en général
  else if (normalizedQuestion.includes('action') || normalizedQuestion.includes('opération')) {
    result = actions;
    summary = `Types d'actions détectées : ${actions.join(', ')}`;
    explanation = 'Liste des types d\'actions effectuées sur la base de données.';
  }
  // Questions sur les objets en général
  else if (normalizedQuestion.includes('objet') || normalizedQuestion.includes('table')) {
    result = objects;
    summary = `Objets accédés : ${objects.join(', ')}`;
    explanation = 'Liste des objets de base de données accédés.';
  }
  // Questions sur les nombres/statistiques
  else if (normalizedQuestion.includes('combien') || normalizedQuestion.includes('nombre')) {
    const total = logs.length;
    result = total;
    summary = `Nombre total d'entrées d'audit : ${total}`;
    explanation = 'Nombre total d\'actions enregistrées dans les logs d\'audit.';
  }
  // Réponse par défaut avec analyse générale
  else {
    result = {
      total_entrees: logs.length,
      utilisateurs: users,
      actions: actions,
      objets: objects
    };
    summary = `Analyse générale : ${logs.length} entrées, ${users.length} utilisateurs, ${actions.length} types d'actions, ${objects.length} objets.`;
    explanation = 'Vue d\'ensemble des données d\'audit disponibles.';
  }

  return {
    type,
    data: result,
    columns,
    summary,
    explanation
  };
}

module.exports = { questionTemplates, answerQuestion };

