-- Drop the recursive SELECT policy on user_roles
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Create the new non-recursive SELECT policy for admins
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT
USING (
  (SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
);
