
import React from "react";
import { Link } from "react-router-dom";

export function SignUpFooter() {
  return (
    <div className="text-center text-sm">
      Already have an account?{" "}
      <Link to="/sign-in" className="text-primary hover:underline">
        Sign in
      </Link>
    </div>
  );
}
