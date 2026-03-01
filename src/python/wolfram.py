import os
from supabase import create_client, Client 
from dotenv import load_dotenv
load_dotenv()

print(os.getenv("NEXT_PUBLIC_SUPABASE_URL"))
# print(os.environ)
# print(os.environ.get("NEXT_PUBLIC_SUPABASE_URL"))

supabase_client = create_client(os.environ.get("NEXT_PUBLIC_SUPABASE_URL"), os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY"), options=None)
import inspect
print(inspect.getmembers(supabase_client))
breakpoint()
# supabase_client.select("*")
print(vars(supabase_client))
