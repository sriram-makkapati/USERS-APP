from flask import Blueprint, request, jsonify
from models import engine, session, Base
from models import User, DatasetAccess
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text


main_blueprint = Blueprint('main', __name__)

@main_blueprint.route('/add_user', methods=['POST'])
def add_user():
    try:
        data = request.get_json()
        if not data or not all(key in data for key in ['USER_NAME', 'PASSWORD', 'ROLE_ID']):
            return jsonify({"message": "Invalid input"}), 400

        result = session.execute(text("""
            SELECT "USER_ID" FROM "UTIL"."DATABBUDDY_USERS"
        """))
        user_ids = [row[0] for row in result.fetchall()]

        if user_ids:
            next_user_id = max([int(user_id) for user_id in user_ids]) + 1
        else:
            next_user_id = 1

        result = session.execute(
            text("""
            SELECT "USER_NAME" 
            FROM "UTIL"."DATABBUDDY_USERS" 
            WHERE "USER_NAME" = :user_name
            """),
            {'user_name': data['USER_NAME']}
        )
        existing_user = result.fetchone()

        if existing_user:
            return jsonify({"message": "User already exists"}), 409

        session.execute(
            text("""
            INSERT INTO "UTIL"."DATABBUDDY_USERS" ("USER_ID", "USER_NAME", "PASSWORD", "ROLE_ID")
            VALUES (:user_id, :user_name, :password, :role_id)
            """),
            {
                'user_id': next_user_id,
                'user_name': data['USER_NAME'],
                'password': data['PASSWORD'],
                'role_id': data['ROLE_ID']
            }
        )
        session.commit()
        return jsonify({"message": f"User added successfully with USER_ID {next_user_id}"}), 201

    except Exception as e:
        session.rollback()
        return jsonify({"message": str(e)}), 500

@main_blueprint.route('/api/role', methods=['POST'])
def add_role():
    try:
        data = request.get_json()
        if not data or not isinstance(data, dict):
            return jsonify({"message": "Invalid JSON format"}), 400
        if not data or not all(key in data for key in ['ROLE_NAME', 'DATASET_ACCESS']):
            return jsonify({"message": "Invalid input"}), 400

        result = session.execute(
            text("""
            SELECT "ROLE_ID" 
            FROM "UTIL"."USER_ROLES"
            WHERE "ROLE_NAME" = :role_name
            """),
            {'role_name': data['ROLE_NAME']}
        )
        existing_role = result.fetchone()

        if existing_role:
            return jsonify({"message": "Role already exists"}), 409

        result = session.execute(
            text("""
            SELECT COALESCE(MAX("ROLE_ID"), 0) + 1 AS next_role_id
            FROM "UTIL"."USER_ROLES"
            """)
        )
        next_role_id = result.fetchone()[0]

        session.execute(
            text("""
            INSERT INTO "UTIL"."USER_ROLES" ("ROLE_ID", "ROLE_NAME", "DATASET_ACCESS")
            VALUES (:role_id, :role_name, :dataset_access)
            """),
            {
                'role_id': next_role_id,
                'role_name': data['ROLE_NAME'],
                'dataset_access': data['DATASET_ACCESS']
            }
        )
        session.commit()

        return jsonify({"message": f"Role added successfully with ROLE_ID {next_role_id}"}), 201

    except Exception as e:
        session.rollback()
        return jsonify({"message": str(e)}), 500



@main_blueprint.route('/user_roles', methods=['GET'])
def get_user_roles():
    try:
       
        result = session.execute(text("""
            SELECT "ROLE_ID", "ROLE_NAME", "DATASET_ACCESS" 
            FROM "UTIL"."USER_ROLES"
        """))
        roles = result.fetchall()
        role_list = [
            {
                "ROLE_ID": row[0],
                "ROLE_NAME": row[1],
                "DATASET_ACCESS": row[2]
            }
            for row in roles
        ]
        session.commit()
        return jsonify(role_list), 200

    except Exception as e:
        session.rollback()
        return jsonify({"message": str(e)}), 500

        
@main_blueprint.route('/update_role/<string:username>', methods=['PUT'])
def update_role(username):
    data = request.get_json()
    if not data or 'ROLE_ID' not in data:
        return jsonify({"message": "Invalid input"}), 400

    try:
        result = session.execute(
            text("""
            UPDATE "UTIL"."DATABBUDDY_USERS"
            SET "ROLE_ID" = :role_id
            WHERE "USER_NAME" = :username
            """), 
            {'role_id': data['ROLE_ID'], 'username': username}
        )

        if result.rowcount > 0:
            session.commit()
            return jsonify({"message": "Role updated successfully"}), 200
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"message": str(e)}), 500


@main_blueprint.route('/api/users/<string:username>/roles', methods=['GET'])
def get_user_roles_by_username(username):
    try:
        result = session.execute(
            text("""
                SELECT ur."ROLE_ID", ur."ROLE_NAME"
                FROM "UTIL"."USER_ROLES" ur
                JOIN "UTIL"."DATABBUDDY_USERS" du ON ur."ROLE_ID" = du."ROLE_ID"
                WHERE du."USER_NAME" = :username
            """), {'username': username}
        )
        roles = result.fetchall()
        role_list = [{"ROLE_ID": row[0], "ROLE_NAME": row[1]} for row in roles]
        return jsonify(role_list), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@main_blueprint.route('/api/roles/<string:roleId>', methods=['PUT'])
def update_role_details(roleId):
    data = request.get_json()

    if not data or 'ROLE_NAME' not in data or 'DATASET_ACCESS' not in data:
        return jsonify({"message": "Invalid input"}), 400

    try:
        roleId = int(roleId)

        result = session.execute(
            text("""
            UPDATE "UTIL"."USER_ROLES"
            SET "ROLE_NAME" = :role_name, "DATASET_ACCESS" = :dataset_access
            WHERE "ROLE_ID" = :role_id
            """),
            {
                'role_name': data['ROLE_NAME'],
                'dataset_access': data['DATASET_ACCESS'],
                'role_id': roleId
            }
        )
        updated_rows = result.rowcount

        if updated_rows > 0:
            session.commit()
            return jsonify({"message": "Role updated successfully"}), 200
        else:
            return jsonify({"message": "Role not found"}), 404

    except Exception as e:
        session.rollback()
        return jsonify({"message": str(e)}), 500




@main_blueprint.route('/api/roles/<string:roleId>', methods=['DELETE'])
def delete_role(roleId):
    try:
        result = session.execute(
            text("""
            DELETE FROM "UTIL"."USER_ROLES"
            WHERE "ROLE_ID" = :role_id  -- Match this to the exact column name
            """),
            {'role_id': roleId}
        )
        if result.rowcount > 0:
            session.commit()
            return jsonify({"message": "Role deleted successfully"}), 200
        else:
            return jsonify({"message": "Role not found"}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"message": str(e)}), 500
        
@main_blueprint.route('/delete_user/<string:username>', methods=['DELETE'])
def delete_user(username):
    try:
     
        result = session.execute(
            text("""
            DELETE FROM "UTIL"."DATABBUDDY_USERS"
            WHERE "USER_NAME" = :username
            """),
            {'username': username}
        )

       
        if result.rowcount > 0:
            session.commit()
            return jsonify({"message": "User deleted successfully"}), 200
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        
        session.rollback()
        return jsonify({"message": str(e)}), 500
        
@main_blueprint.route('/api/users', methods=['GET'])
def get_all_users():
    try:
       
        result = session.execute(
            text("""
            SELECT "USER_ID", "USER_NAME", "PASSWORD", "ROLE_ID"
            FROM "UTIL"."DATABBUDDY_USERS"
            """)
        )
        users = result.fetchall()

        
        user_list = [
            {
                "USER_ID": row[0],
                "USER_NAME": row[1],
                "PASSWORD": row[2],
                "ROLE_ID": row[3]
            }
            for row in users
        ]
        return jsonify(user_list), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500

@main_blueprint.route('/api/roles', methods=['GET'])
def get_all_roles():
    try:
       
        result = session.execute(
            text("""
            SELECT "ROLE_ID", "ROLE_NAME", "DATASET_ACCESS"
            FROM "UTIL"."USER_ROLES"
            """)
        )
        roles = result.fetchall()
        role_list = [
            {
                "ROLE_ID": row[0],
                "ROLE_NAME": row[1],
                "DATASET_ACCESS": row[2]
            }
            for row in roles
        ]
        return jsonify(role_list), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500

@main_blueprint.route('/distinctDatasets', methods=['GET'])
def get_distinct_datasets():
    try:
        result = session.execute(
            text("""
                SELECT DISTINCT "DOMAIN_DETAILS"
                FROM "UTIL"."METADATA_ENRICHMENT_V2"
            """)
        )
        datasets = result.fetchall()
        dataset_list = [{"DOMAIN_DETAILS": row[0]} for row in datasets]
        return jsonify(dataset_list), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500











