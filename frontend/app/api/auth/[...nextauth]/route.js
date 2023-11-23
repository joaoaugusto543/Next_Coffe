import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { baseUrl } from "../../api"
import { createSession } from "@/services/sessionServices"

const nextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'email', type: 'email' },
				password: { label: 'password', type: 'password' }
			},

			async authorize(credentials, req) {

                const {user,token}=await createSession(credentials?.email,credentials?.password)

				if (user && token) {
					return {user,token}
				}

				return null
			},
		})
	],
	pages: {
		signIn: '/login'
	},
    callbacks:{
        async jwt({token,user}){
			if(user){
				token.user=user.user
				token.token=user.token
			}

            return token
    	},

		async session({session,token}){
			session.user=token.user
			session.token=token.token

			return session
		}
	}	

}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST, nextAuthOptions }