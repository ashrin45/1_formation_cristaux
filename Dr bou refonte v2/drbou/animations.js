/* Copie de animations.json, pour ouvrir demo.html par double-clic (sans serveur). Après une modification de
   animations.json, recopier son contenu après le signe égal ci-dessous, ou ouvrir la démo via un serveur local. */
window.DRBOU_ANIMATIONS = {
 "_aide": {
  "_lire": "Ce bloc _aide ne sert qu'à la lecture : le lecteur l'ignore. Le guide complet est LISEZMOI.html.",
  "version": "Version du format de ce fichier.",
  "repere": "Le cadre de la neutre en version 1x (512 x 512 px). Toutes les ancres sont exprimées dans ce repère : (0, 0) est le coin haut gauche du cadre de la neutre.",
  "versions": "Les jeux d'images. dossier : chemin des images, relatif à ce fichier ; facteur : taille des images par rapport aux valeurs 1x écrites dans clips (2 = le double).",
  "version_par_defaut": "Version imposée au lecteur (null : il choisit 1x ou 2x selon l'écran).",
  "images_par_seconde": "Cadence de base de tous les clips (16, celle du rendu).",
  "vitesse": "Multiplicateur global (1 = normal, 2 = deux fois plus vite, 0.5 = deux fois plus lent).",
  "regle_des_images": "Explique pourquoi chaque clip a 48 images et non 49.",
  "poses": "Les poses de raccord : un clip qui finit sur une pose s'enchaîne sans saut avec un clip qui commence sur la même pose.",
  "clips.<nom>.prefixe": "Début du nom des images : l'image k s'appelle prefixe + k sur trois chiffres + .webp (db_vol_gauche_boucle_017.webp). Les noms sont uniques dans tout le paquet.",
  "clips.<nom>.images": "Nombre d'images du clip.",
  "clips.<nom>.largeur / hauteur": "Taille des images en version 1x (multiplier par le facteur pour les autres versions).",
  "clips.<nom>.ancre": "Place du coin haut gauche du cadre de la neutre dans l'image du clip, en pixels 1x (x, y ; peut être négative si l'image commence à l'intérieur du cadre), et echelle : nombre de pixels d'image pour un pixel du repère (1 partout ici). Le lecteur dessine l'image en (-x / echelle, -y / echelle) dans le repère.",
  "clips.<nom>.debut / fin": "Pose de début et pose de fin du clip.",
  "clips.<nom>.boucle": "true si le clip finit sur sa pose de début : il peut se répéter sans saut.",
  "clips.<nom>.vitesse": "Multiplicateur propre au clip (1 = normal).",
  "clips.<nom>.duree_s": "Durée à la cadence de base, pour information.",
  "enchainements.<nom>.etapes": "Liste ordonnée des étapes. Une étape joue clip (un nom) ou choix (une liste : une variante tirée au hasard), tours fois de suite.",
  "enchainements.<nom>.etapes[].tours": "Nombre de répétitions de l'étape (1 par défaut).",
  "enchainements.<nom>.etapes[].tours_variables": "true : le site peut changer le nombre de tours de cette étape à l'appel (jouer(nom, {tours: 5})).",
  "enchainements.<nom>.etapes[].deplacement": "true : pendant cette étape, voler() déplace Dr Bou de son point de départ vers sa cible.",
  "enchainements.<nom>.vitesse": "Multiplicateur propre à l'enchaînement (1 = normal).",
  "enchainements.<nom>.repetitions": "Nombre de fois que l'enchaînement entier est joué (1 par défaut).",
  "repos": "Animation jouée de temps en temps quand Dr Bou n'a rien à faire : enchainement, pause minimale et maximale en secondes. actif false : il reste immobile sur la neutre.",
  "absents": "Ce que le paquet ne contient pas encore, et pourquoi.",
  "Vitesse réelle": "images par seconde = images_par_seconde x vitesse (globale) x réglage du site (méthode vitesse) x vitesse de l'enchaînement x vitesse du clip."
 },
 "version": 1,
 "nom": "Dr Bou",
 "construit": "2026-10-24 16:50",
 "repere": {
  "largeur": 512,
  "hauteur": 512,
  "note": "cadre de la neutre en version 1x ; Dr Bou y tient debout, de face"
 },
 "versions": {
  "1x": {
   "dossier": "images/1x",
   "facteur": 1,
   "neutre_px": 512
  },
  "2x": {
   "dossier": "images/2x",
   "facteur": 2,
   "neutre_px": 1024
  },
  "site": {
   "dossier": "images/site",
   "facteur": 0.625,
   "neutre_px": 320
  }
 },
 "version_par_defaut": null,
 "images_par_seconde": 16,
 "vitesse": 1,
 "regle_des_images": "Chaque clip source a 49 images ; la première (image 0) est identique à la pose de début, c'est-à-dire à la dernière image du clip précédent ou à la neutre. Elle est retirée : un clip commence à l'image qui suit sa pose de début, et sa dernière image est exactement sa pose de fin. Un clip qui finit sur sa pose de début (boucle true) se répète donc sans image en double, et la neutre s'affiche seule au repos.",
 "poses": {
  "neutre": "debout, de face (image db_neutre_000.webp)",
  "montrer_gauche": "aile tendue vers la gauche de l'écran",
  "montrer_droite": "aile tendue vers la droite de l'écran",
  "vol_gauche": "en vol, de trois quarts vers la gauche",
  "vol_droite": "en vol, de trois quarts vers la droite"
 },
 "clips": {
  "neutre": {
   "prefixe": "db_neutre_",
   "images": 1,
   "largeur": 304,
   "hauteur": 416,
   "ancre": {
    "x": -104,
    "y": -56,
    "echelle": 1
   },
   "debut": "neutre",
   "fin": "neutre",
   "boucle": false,
   "vitesse": 1,
   "duree_s": 0.06,
   "famille": "neutre",
   "source": "mascotte\\base\\neutre_1024.png (première et dernière image des clips de la phase 1)"
  },
  "attendre_g1": {
   "prefixe": "db_attendre_g1_",
   "images": 48,
   "largeur": 304,
   "hauteur": 416,
   "ancre": {
    "x": -104,
    "y": -56,
    "echelle": 1
   },
   "debut": "neutre",
   "fin": "neutre",
   "boucle": true,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "attendre",
   "source": "ComfyUI_3d\\output\\phase1_retenus\\attendre_g1 (images 1 à 48)",
   "calcul": "20 pas, graine 1"
  },
  "attendre_g2": {
   "prefixe": "db_attendre_g2_",
   "images": 48,
   "largeur": 304,
   "hauteur": 424,
   "ancre": {
    "x": -104,
    "y": -48,
    "echelle": 1
   },
   "debut": "neutre",
   "fin": "neutre",
   "boucle": true,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "attendre",
   "source": "ComfyUI_3d\\output\\phase1_retenus\\attendre_g2 (images 1 à 48)",
   "calcul": "20 pas, graine 2"
  },
  "attendre_g3": {
   "prefixe": "db_attendre_g3_",
   "images": 48,
   "largeur": 304,
   "hauteur": 416,
   "ancre": {
    "x": -104,
    "y": -56,
    "echelle": 1
   },
   "debut": "neutre",
   "fin": "neutre",
   "boucle": true,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "attendre",
   "source": "ComfyUI_3d\\output\\phase1_retenus\\attendre_g3 (images 1 à 48)",
   "calcul": "20 pas, graine 3"
  },
  "attendre_g4": {
   "prefixe": "db_attendre_g4_",
   "images": 48,
   "largeur": 304,
   "hauteur": 416,
   "ancre": {
    "x": -104,
    "y": -56,
    "echelle": 1
   },
   "debut": "neutre",
   "fin": "neutre",
   "boucle": true,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "attendre",
   "source": "ComfyUI_3d\\output\\phase1_retenus\\attendre_g4 (images 1 à 48)",
   "calcul": "20 pas, graine 4"
  },
  "attendre_g6": {
   "prefixe": "db_attendre_g6_",
   "images": 48,
   "largeur": 304,
   "hauteur": 416,
   "ancre": {
    "x": -104,
    "y": -56,
    "echelle": 1
   },
   "debut": "neutre",
   "fin": "neutre",
   "boucle": true,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "attendre",
   "source": "ComfyUI_3d\\output\\phase1_retenus_4pas\\attendre_g6 (images 1 à 48)",
   "calcul": "4 pas, graine 6"
  },
  "parler_g2": {
   "prefixe": "db_parler_g2_",
   "images": 48,
   "largeur": 312,
   "hauteur": 424,
   "ancre": {
    "x": -104,
    "y": -48,
    "echelle": 1
   },
   "debut": "neutre",
   "fin": "neutre",
   "boucle": true,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "parler",
   "source": "ComfyUI_3d\\output\\phase1_retenus\\parler_g2 (images 1 à 48)",
   "calcul": "20 pas, graine 2"
  },
  "parler_g5": {
   "prefixe": "db_parler_g5_",
   "images": 48,
   "largeur": 304,
   "hauteur": 424,
   "ancre": {
    "x": -104,
    "y": -48,
    "echelle": 1
   },
   "debut": "neutre",
   "fin": "neutre",
   "boucle": true,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "parler",
   "source": "ComfyUI_3d\\output\\phase1_retenus\\parler_g5 (images 1 à 48)",
   "calcul": "20 pas, graine 5"
  },
  "ecouter_g1": {
   "prefixe": "db_ecouter_g1_",
   "images": 48,
   "largeur": 304,
   "hauteur": 432,
   "ancre": {
    "x": -104,
    "y": -40,
    "echelle": 1
   },
   "debut": "neutre",
   "fin": "neutre",
   "boucle": true,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "écouter",
   "source": "ComfyUI_3d\\output\\phase1_retenus\\ecouter_g1 (images 1 à 48)",
   "calcul": "20 pas, graine 1"
  },
  "ecouter_g2": {
   "prefixe": "db_ecouter_g2_",
   "images": 48,
   "largeur": 304,
   "hauteur": 424,
   "ancre": {
    "x": -104,
    "y": -48,
    "echelle": 1
   },
   "debut": "neutre",
   "fin": "neutre",
   "boucle": true,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "écouter",
   "source": "ComfyUI_3d\\output\\phase1_retenus\\ecouter_g2 (images 1 à 48)",
   "calcul": "20 pas, graine 2"
  },
  "ecouter_g5": {
   "prefixe": "db_ecouter_g5_",
   "images": 48,
   "largeur": 304,
   "hauteur": 416,
   "ancre": {
    "x": -104,
    "y": -56,
    "echelle": 1
   },
   "debut": "neutre",
   "fin": "neutre",
   "boucle": true,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "écouter",
   "source": "ComfyUI_3d\\output\\phase1_retenus\\ecouter_g5 (images 1 à 48)",
   "calcul": "20 pas, graine 5"
  },
  "montrer_gauche_entree": {
   "prefixe": "db_montrer_gauche_entree_",
   "images": 48,
   "largeur": 512,
   "hauteur": 424,
   "ancre": {
    "x": 104,
    "y": -48,
    "echelle": 1
   },
   "debut": "neutre",
   "fin": "montrer_gauche",
   "boucle": false,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "montrer à gauche : entrée",
   "source": "ComfyUI_3d\\output\\montrer\\entree_corps_gauche_g6_g7 (images 1 à 48)",
   "calcul": "20 pas, graine 7"
  },
  "montrer_gauche_tenue": {
   "prefixe": "db_montrer_gauche_tenue_",
   "images": 48,
   "largeur": 512,
   "hauteur": 424,
   "ancre": {
    "x": 104,
    "y": -48,
    "echelle": 1
   },
   "debut": "montrer_gauche",
   "fin": "montrer_gauche",
   "boucle": true,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "montrer à gauche : tenue",
   "source": "ComfyUI_3d\\output\\montrer\\tenue_gauche_g6_g1 (images 1 à 48)",
   "calcul": "20 pas, graine 1"
  },
  "montrer_gauche_sortie": {
   "prefixe": "db_montrer_gauche_sortie_",
   "images": 48,
   "largeur": 512,
   "hauteur": 416,
   "ancre": {
    "x": 104,
    "y": -56,
    "echelle": 1
   },
   "debut": "montrer_gauche",
   "fin": "neutre",
   "boucle": false,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "montrer à gauche : sortie",
   "source": "ComfyUI_3d\\output\\montrer\\sortie_gauche_g6_g1 (images 1 à 48)",
   "calcul": "20 pas, graine 1"
  },
  "montrer_droite_entree": {
   "prefixe": "db_montrer_droite_entree_",
   "images": 48,
   "largeur": 528,
   "hauteur": 424,
   "ancre": {
    "x": -96,
    "y": -48,
    "echelle": 1
   },
   "debut": "neutre",
   "fin": "montrer_droite",
   "boucle": false,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "montrer à droite : entrée",
   "source": "ComfyUI_3d\\output\\montrer\\entree_regard_droite_ref_g4_g8 (images 1 à 48)",
   "calcul": "20 pas, graine 8"
  },
  "montrer_droite_tenue": {
   "prefixe": "db_montrer_droite_tenue_",
   "images": 48,
   "largeur": 512,
   "hauteur": 424,
   "ancre": {
    "x": -104,
    "y": -48,
    "echelle": 1
   },
   "debut": "montrer_droite",
   "fin": "montrer_droite",
   "boucle": true,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "montrer à droite : tenue",
   "source": "ComfyUI_3d\\output\\montrer\\tenue_droite_ref_g4_g1 (images 1 à 48)",
   "calcul": "20 pas, graine 1"
  },
  "montrer_droite_sortie": {
   "prefixe": "db_montrer_droite_sortie_",
   "images": 48,
   "largeur": 512,
   "hauteur": 416,
   "ancre": {
    "x": -104,
    "y": -56,
    "echelle": 1
   },
   "debut": "montrer_droite",
   "fin": "neutre",
   "boucle": false,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "montrer à droite : sortie",
   "source": "ComfyUI_3d\\output\\montrer\\sortie_droite_ref_g4_g4 (images 1 à 48)",
   "calcul": "20 pas, graine 4"
  },
  "vol_gauche_decollage": {
   "prefixe": "db_vol_gauche_decollage_",
   "images": 48,
   "largeur": 816,
   "hauteur": 728,
   "ancre": {
    "x": 136,
    "y": 256,
    "echelle": 1
   },
   "debut": "neutre",
   "fin": "vol_gauche",
   "boucle": false,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "voler à gauche : décollage",
   "source": "ComfyUI_3d\\output\\vol_pose\\decollage_pose_vol_gauche_e75_g4_g7 (images 1 à 48)",
   "calcul": "20 pas, graine 7"
  },
  "vol_gauche_boucle": {
   "prefixe": "db_vol_gauche_boucle_",
   "images": 48,
   "largeur": 848,
   "hauteur": 584,
   "ancre": {
    "x": 168,
    "y": 192,
    "echelle": 1
   },
   "debut": "vol_gauche",
   "fin": "vol_gauche",
   "boucle": true,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "voler à gauche : boucle",
   "source": "ComfyUI_3d\\output\\vol_pose\\boucle_pose_vol_gauche_e75_g4_g7 (images 1 à 48)",
   "calcul": "20 pas, graine 7"
  },
  "vol_gauche_atterrissage": {
   "prefixe": "db_vol_gauche_atterrissage_",
   "images": 48,
   "largeur": 848,
   "hauteur": 656,
   "ancre": {
    "x": 168,
    "y": 184,
    "echelle": 1
   },
   "debut": "vol_gauche",
   "fin": "neutre",
   "boucle": false,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "voler à gauche : atterrissage",
   "source": "ComfyUI_3d\\output\\vol_pose\\atterrissage_pose_vol_gauche_e75_g4_g7 (images 1 à 48)",
   "calcul": "20 pas, graine 7"
  },
  "vol_droite_decollage": {
   "prefixe": "db_vol_droite_decollage_",
   "images": 48,
   "largeur": 832,
   "hauteur": 728,
   "ancre": {
    "x": 160,
    "y": 256,
    "echelle": 1
   },
   "debut": "neutre",
   "fin": "vol_droite",
   "boucle": false,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "voler à droite : décollage",
   "source": "ComfyUI_3d\\output\\vol_pose\\decollage_pose_vol_droite_e75_g5_g9 (images 1 à 48)",
   "calcul": "20 pas, graine 9"
  },
  "vol_droite_boucle": {
   "prefixe": "db_vol_droite_boucle_",
   "images": 48,
   "largeur": 800,
   "hauteur": 664,
   "ancre": {
    "x": 152,
    "y": 216,
    "echelle": 1
   },
   "debut": "vol_droite",
   "fin": "vol_droite",
   "boucle": true,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "voler à droite : boucle",
   "source": "ComfyUI_3d\\output\\vol_pose\\boucle_pose_vol_droite_e75_g5_g7 (images 1 à 48)",
   "calcul": "20 pas, graine 7"
  },
  "vol_droite_atterrissage": {
   "prefixe": "db_vol_droite_atterrissage_",
   "images": 48,
   "largeur": 848,
   "hauteur": 696,
   "ancre": {
    "x": 168,
    "y": 224,
    "echelle": 1
   },
   "debut": "vol_droite",
   "fin": "neutre",
   "boucle": false,
   "vitesse": 1,
   "duree_s": 3.0,
   "famille": "voler à droite : atterrissage",
   "source": "ComfyUI_3d\\output\\vol_pose\\atterrissage_pose_vol_droite_e75_g5_g7 (images 1 à 48)",
   "calcul": "20 pas, graine 7"
  }
 },
 "enchainements": {
  "attendre": {
   "description": "Attente calme, un clignement (une variante au hasard).",
   "etapes": [
    {
     "choix": [
      "attendre_g1",
      "attendre_g2",
      "attendre_g3",
      "attendre_g4",
      "attendre_g6"
     ],
     "tours": 1
    }
   ],
   "vitesse": 1,
   "repetitions": 1
  },
  "parler": {
   "description": "Dr Bou parle (une variante au hasard).",
   "etapes": [
    {
     "choix": [
      "parler_g2",
      "parler_g5"
     ],
     "tours": 1
    }
   ],
   "vitesse": 1,
   "repetitions": 1
  },
  "ecouter": {
   "description": "Dr Bou écoute (une variante au hasard).",
   "etapes": [
    {
     "choix": [
      "ecouter_g1",
      "ecouter_g2",
      "ecouter_g5"
     ],
     "tours": 1
    }
   ],
   "vitesse": 1,
   "repetitions": 1
  },
  "montrer_gauche": {
   "description": "Montre quelque chose à gauche : entrée, tenue répétée, sortie.",
   "etapes": [
    {
     "clip": "montrer_gauche_entree"
    },
    {
     "clip": "montrer_gauche_tenue",
     "tours": 3,
     "tours_variables": true
    },
    {
     "clip": "montrer_gauche_sortie"
    }
   ],
   "vitesse": 1,
   "repetitions": 1
  },
  "montrer_droite": {
   "description": "Montre quelque chose à droite : entrée, tenue répétée, sortie.",
   "etapes": [
    {
     "clip": "montrer_droite_entree"
    },
    {
     "clip": "montrer_droite_tenue",
     "tours": 1,
     "tours_variables": true
    },
    {
     "clip": "montrer_droite_sortie"
    }
   ],
   "vitesse": 1,
   "repetitions": 1
  },
  "voler_gauche": {
   "description": "S'envole vers la gauche : décollage, battements répétés pendant le trajet, atterrissage.",
   "etapes": [
    {
     "clip": "vol_gauche_decollage"
    },
    {
     "clip": "vol_gauche_boucle",
     "tours": 2,
     "tours_variables": true,
     "deplacement": true
    },
    {
     "clip": "vol_gauche_atterrissage"
    }
   ],
   "vitesse": 1,
   "repetitions": 1
  },
  "voler_droite": {
   "description": "S'envole vers la droite : décollage, battements répétés pendant le trajet, atterrissage.",
   "etapes": [
    {
     "clip": "vol_droite_decollage"
    },
    {
     "clip": "vol_droite_boucle",
     "tours": 2,
     "tours_variables": true,
     "deplacement": true
    },
    {
     "clip": "vol_droite_atterrissage"
    }
   ],
   "vitesse": 1,
   "repetitions": 1
  }
 },
 "repos": {
  "actif": true,
  "enchainement": "attendre",
  "pause_min_s": 4,
  "pause_max_s": 10
 },
 "absents": [
  "Montrer vers le haut, en haut à gauche et en haut à droite (phase 2) : pas de jeu complet validé (entrée, tenue, sortie), non inclus.",
  "Voler dans d'autres directions que gauche et droite : rien n'a été rendu.",
  "Son : aucun."
 ]
};
